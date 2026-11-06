const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

const controllerPath = path.resolve(
  __dirname,
  'controllers',
  'predictionController.js'
);

async function runScenario(scenario) {
  const calls = [];
  let queryNumber = 0;

  const now = Date.now();
  const existingPrediction = {
    prediction_id: 'EXISTING-PREDICTION',
    queue_id: 'TEST-QUEUE',
    patient_id: 'TEST-PATIENT',
    doctor_id: 'TEST-DOCTOR',
    predicted_wait_minutes: 15,
    minimum_wait_minutes: 10,
    maximum_wait_minutes: 20,
    confidence_score: null,
    model_version: 'RF-1.0',
    prediction_time: new Date(
      now - (scenario === 'recent' ? 30_000 : 3 * 60_000)
    ).toISOString()
  };

  const fakePool = {
    async query(sql, params = []) {
      calls.push({ sql, params });
      queryNumber++;

      if (queryNumber === 1) {
        return {
          rows: [{
            queue_id: 'TEST-QUEUE',
            patient_id: 'TEST-PATIENT',
            doctor_id: 'TEST-DOCTOR',
            queue_date: '2026-10-14',
            queue_position: 3,
            status: scenario === 'completed' ? 'COMPLETED' : 'WAITING',
            average_consultation_time: 7
          }]
        };
      }

      if (queryNumber === 2) {
        return {
          rows: scenario === 'missing' ? [] : [existingPrediction]
        };
      }

      if (queryNumber === 3) {
        return {
          rows: [{
            patients_ahead: 2,
            priority_patients_ahead: 1
          }]
        };
      }

      if (queryNumber === 4) {
        assert.match(sql, /UPDATE\s+wait_time_predictions/i);
        assert.doesNotMatch(sql, /INSERT\s+INTO\s+wait_time_predictions/i);

        return {
          rows: [{
            prediction_id: params[5],
            predicted_wait_minutes: params[3],
            minimum_wait_minutes: params[1],
            maximum_wait_minutes: params[2],
            confidence_score: params[4],
            model_version: params[4],
            queue_id: 'TEST-QUEUE',
            patient_id: 'TEST-PATIENT',
            doctor_id: 'TEST-DOCTOR'
          }]
        };
      }

      throw new Error(`Unexpected database query #${queryNumber}`);
    }
  };

  const originalLoad = Module._load;

  try {
    Module._load = function(request, parent, isMain) {
      if (parent && parent.filename === controllerPath) {
        if (request === '../config/db') {
          return { pool: fakePool };
        }

        if (request === '../utils/idGenerator') {
          return {
            generateUniqueId: async () => 'NEW-TEST-PREDICTION'
          };
        }
      }

      return originalLoad.call(this, request, parent, isMain);
    };

    delete require.cache[controllerPath];
    const { getPrediction } = require(controllerPath);

    const req = { params: { queueEntryId: 'TEST-QUEUE' } };
    let statusCode = 200;
    let responseBody;

    const res = {
      status(code) {
        statusCode = code;
        return this;
      },
      json(body) {
        responseBody = body;
        return this;
      }
    };

    await getPrediction(req, res);

    return { statusCode, responseBody, calls };
  } finally {
    Module._load = originalLoad;
    delete require.cache[controllerPath];
  }
}

test('recent prediction is reused without refreshing', async () => {
  const result = await runScenario('recent');

  assert.equal(result.statusCode, 200);
  assert.equal(result.responseBody.success, true);
  assert.equal(result.responseBody.data.prediction_id, 'EXISTING-PREDICTION');
  assert.equal(result.calls.length, 2);

  console.log('PASS: recent prediction reused; no database write requested.');
});

test('completed queue is rejected without refreshing', async () => {
  const result = await runScenario('completed');

  assert.equal(result.statusCode, 409);
  assert.equal(result.responseBody.success, false);
  assert.equal(result.calls.length, 1);

  console.log('PASS: completed queue rejected; no prediction write requested.');
});

test('stale prediction is recalculated and updated', async () => {
  const result = await runScenario('stale');

  assert.equal(result.statusCode, 200);
  assert.equal(result.responseBody.success, true);
  assert.equal(result.responseBody.data.prediction_id, 'EXISTING-PREDICTION');
  assert.equal(result.calls.length, 4);
  assert.match(result.calls[3].sql, /UPDATE\s+wait_time_predictions/i);
  assert.doesNotMatch(result.calls[3].sql, /INSERT\s+INTO\s+wait_time_predictions/i);

  console.log('PASS: stale prediction recalculated and existing row updated.');
  console.log('Database operations were mocked; no real database was changed.');
});
