const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { startLon, startLat, endLon, endLat } = req.query;

        if (startLon === undefined || startLat === undefined || endLon === undefined || endLat === undefined) {
            return res.status(400).json({
                error: "Start and destination coordinates are required."
            });
        }

        const sLon = Number(startLon);
        const sLat = Number(startLat);
        const eLon = Number(endLon);
        const eLat = Number(endLat);

        if (
            !Number.isFinite(sLon) || !Number.isFinite(sLat) ||
            !Number.isFinite(eLon) || !Number.isFinite(eLat) ||
            sLat < -90 || sLat > 90 || eLat < -90 || eLat > 90 ||
            sLon < -180 || sLon > 180 || eLon < -180 || eLon > 180
        ) {
            return res.status(400).json({
                error: "Invalid coordinates provided. Latitude must be between -90 and 90, Longitude must be between -180 and 180."
            });
        }

        const tomtomKey = process.env.TOMTOM_API_KEY;
        const geoapifyKey = process.env.GEOAPIFY_API_KEY;

        if ((!tomtomKey || !tomtomKey.trim()) && (!geoapifyKey || !geoapifyKey.trim())) {
            console.error("[Directions Route] Neither TOMTOM_API_KEY nor GEOAPIFY_API_KEY is configured in server environment.");
            return res.status(503).json({
                error: "Routing service is unavailable: No routing API keys configured in server environment."
            });
        }

        // ====================================================================
        // 1. PRIMARY PROVIDER: TomTom Routing API (traffic-aware)
        // ====================================================================
        if (tomtomKey && tomtomKey.trim()) {
            try {
                const tomtomUrl = `https://api.tomtom.com/routing/1/calculateRoute/${sLat},${sLon}:${eLat},${eLon}/json`;
                const ttResponse = await axios.get(tomtomUrl, {
                    params: {
                        key: tomtomKey.trim(),
                        travelMode: "car",
                        routeType: "fastest",
                        traffic: "true",
                        departAt: "now",
                        computeTravelTimeFor: "all"
                    },
                    timeout: 10000
                });

                const route = ttResponse.data?.routes?.[0];
                const summary = route?.summary;

                if (summary && typeof summary.lengthInMeters === 'number' && typeof summary.travelTimeInSeconds === 'number') {
                    return res.json({
                        success: true,
                        provider: "tomtom",
                        isTrafficAware: true,
                        distanceMeters: summary.lengthInMeters,
                        durationSeconds: summary.travelTimeInSeconds,
                        trafficDelaySeconds: summary.trafficDelayInSeconds ?? 0,
                        noTrafficTravelTimeSeconds: summary.noTrafficTravelTimeInSeconds,
                        departureTime: summary.departureTime,
                        arrivalTime: summary.arrivalTime,
                        summary: {
                            distance: summary.lengthInMeters,
                            duration: summary.travelTimeInSeconds
                        },
                        features: [
                            {
                                type: "Feature",
                                properties: {
                                    provider: "tomtom",
                                    isTrafficAware: true,
                                    distance: summary.lengthInMeters,
                                    time: summary.travelTimeInSeconds,
                                    summary: {
                                        distance: summary.lengthInMeters,
                                        duration: summary.travelTimeInSeconds
                                    }
                                }
                            }
                        ]
                    });
                }
            } catch (ttErr) {
                console.error("[Directions Route] Primary provider TomTom failed, attempting Geoapify fallback. Reason:", ttErr.response?.data?.detailedError?.message || ttErr.message);
            }
        }

        // ====================================================================
        // 2. FALLBACK PROVIDER: Geoapify Routing API (free-flow)
        // ====================================================================
        if (geoapifyKey && geoapifyKey.trim()) {
            try {
                const waypoints = `${sLat},${sLon}|${eLat},${eLon}`;
                const geoResponse = await axios.get("https://api.geoapify.com/v1/routing", {
                    params: {
                        waypoints,
                        mode: "drive",
                        type: "balanced",
                        units: "metric",
                        apiKey: geoapifyKey.trim()
                    },
                    timeout: 10000
                });

                const features = geoResponse.data?.features;
                const properties = features?.[0]?.properties;
                const distance = properties?.distance ?? properties?.summary?.distance;
                const duration = properties?.time ?? properties?.summary?.duration;

                if (typeof distance === 'number' && typeof duration === 'number') {
                    return res.json({
                        success: true,
                        provider: "geoapify",
                        isTrafficAware: false,
                        distanceMeters: distance,
                        durationSeconds: duration,
                        summary: {
                            distance,
                            duration
                        },
                        features: [
                            {
                                type: "Feature",
                                properties: {
                                    provider: "geoapify",
                                    isTrafficAware: false,
                                    distance,
                                    time: duration,
                                    summary: {
                                        distance,
                                        duration
                                    }
                                }
                            }
                        ]
                    });
                }
            } catch (geoErr) {
                console.error("[Directions Route] Fallback provider Geoapify failed. Reason:", geoErr.response?.data?.message || geoErr.message);
            }
        }

        return res.status(502).json({
            error: "Unable to calculate driving route. Both primary (TomTom) and fallback (Geoapify) routing services are currently unavailable."
        });

    } catch (error) {
        console.error("[Directions Route Fatal Error]:", error.message);
        res.status(500).json({
            error: "Unable to calculate driving route due to server network error."
        });
    }
});

module.exports = router;