// Centralized AI Waiting-Time Prediction Service Abstraction for AIQ Tracker

export const predictionService = {
  /**
   * Calculate prediction structure from input factors
   * (Prepared for future Python ML / Express API integration)
   */
  getWaitingTimePrediction: (inputData = {}) => {
    const patientsAhead = typeof inputData.patientsAhead === 'number' ? inputData.patientsAhead : 5;
    const avgConsultationTime = inputData.averageConsultationTime || 7;
    const doctorStatus = inputData.doctorStatus || 'Available';
    const dayOfWeek = inputData.dayOfWeek || 'Thursday';
    const currentQueueLength = inputData.currentQueueLength || patientsAhead + 1;

    // Mock Prediction Calculation
    const baseWaitMinutes = patientsAhead * avgConsultationTime;
    const estimatedWaitMin = Math.max(0, baseWaitMinutes > 0 ? baseWaitMinutes + 3 : 0);
    const estimatedWaitMax = baseWaitMinutes > 0 ? baseWaitMinutes + 10 : 0;
    
    // Status determination
    let status = 'Waiting';
    if (patientsAhead === 0) {
      status = 'Your Turn';
    } else if (patientsAhead <= 2) {
      status = 'Almost Your Turn';
    }

    // Turn Time calculation
    const now = new Date();
    const turnDate = new Date(now.getTime() + ((estimatedWaitMin + estimatedWaitMax) / 2) * 60000);
    const estimatedTurnTime = turnDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return {
      inputs: {
        patientsAhead,
        currentQueueLength,
        averageConsultationTime: avgConsultationTime,
        doctorStatus,
        currentHour: now.getHours(),
        currentTimeFormatted: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayOfWeek
      },
      outputs: {
        estimatedWaitMin,
        estimatedWaitMax,
        estimatedWaitText: patientsAhead === 0 ? '0 min (Immediate)' : `${estimatedWaitMin}–${estimatedWaitMax} min`,
        estimatedTurnTime: patientsAhead === 0 ? 'Now' : estimatedTurnTime,
        confidence: 87, // Mock AI confidence score
        status,
        lastUpdated: 'Just now'
      }
    };
  },

  /**
   * Fetch Wait-Time Prediction from Database
   */
  async fetchPrediction(queueEntryId) {
    try {
      const res = await fetch(`http://localhost:5000/api/predictions/${queueEntryId}`);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'Failed to fetch prediction.');
      }
      return {
        estimatedWaitMin: json.data.minimum_wait_minutes,
        estimatedWaitMax: json.data.maximum_wait_minutes,
        confidence: Math.round(parseFloat(json.data.confidence_score)),
        algorithmVersion: json.data.model_version,
        predictedAt: json.data.prediction_time
      };
    } catch (err) {
      console.error('fetchPrediction error:', err);
      throw err;
    }
  }
};
