const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const path = require('node:path');

const controllerPath = path.resolve(
  __dirname,
  'controllers',
  'predictionController.js'
);

const originalLoad = Module._load;
const calls = [];
let queryNumber = 0;

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
          queue_position: 1,
          status: 'WAITING'
        }]
      };
    }

    if (queryNumber === 2) {
      return { rows: [] };
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
      return {
        rows: [{
          prediction_id: params[0],
          queue_id: params[1],
          patient_id: params[2],
          doctor_id: params[3],
          minimum_wait_minutes: params[4],
          maximum_wait_minutes: params[5],
          confidence_score: params[6],
          predicted_wait_minutes: params[7],
          model_version: params[8]
        }]
      };
    }

    throw new Error('Unexpected database query');
  }
};

Module._load = function(request, parent, isMain) {
  if (parent && parent.filename === controllerPath) {
    if (request === '../config/db') {
      return { pool: fakePool };
    }

    if (request === '../utils/idGenerator') {
      return {
        generateUniqueId: async () => 'TEST-PREDICTION-ID'
      };
    }
  }

  return originalLoad.call(this, request, parent, isMain);
};

test('controller calls the real Random Forest script and returns RF-1.0', async () => {
  try {
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

    assert.equal(statusCode, 201);
    assert.equal(responseBody.success, true);
    assert.equal(responseBody.data.model_version, 'RF-1.0');
    assert.equal(typeof responseBody.data.predicted_wait_minutes, 'number');
    assert.equal(calls.length, 4);

    console.log('Controller response:', responseBody);
    console.log('PASS: model invocation and controller response verified.');
    console.log('Database writes: mocked; no real database was changed.');
  } finally {
    Module._load = originalLoad;
    delete require.cache[controllerPath];
  }
});
