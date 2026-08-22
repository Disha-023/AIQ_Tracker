const express = require("express");
const axios = require("axios");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { startLon, startLat, endLon, endLat } = req.query;

        if (!startLon || !startLat || !endLon || !endLat) {
            return res.status(400).json({
                error: "Start and destination coordinates are required"
            });
        }

        const response = await axios.post(
            "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson",
            {
                coordinates: [
                    [Number(startLon), Number(startLat)],
                    [Number(endLon), Number(endLat)]
                ]
            },
            {
                headers: {
                    Authorization: process.env.OPENROUTE_API_KEY,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json(response.data);

    } catch (error) {
        console.error("Directions API Error:");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        res.status(500).json({
            error: "Unable to get directions"
        });
    }
});

module.exports = router;