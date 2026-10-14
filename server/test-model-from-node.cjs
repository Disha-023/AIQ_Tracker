const { spawn } = require('child_process');
const path = require('path');

const script = path.join(__dirname, 'ml-model', 'predict_wait_time.py');

const features = {
  patients_ahead: 4,
  avg_consultation_time_ahead: 8,
  total_consultation_time_ahead: 32,
  max_consultation_time_ahead: 12,
  long_cases_ahead: 1,
  priority_patients_ahead: 1,
  hour_of_day: 10,
  day_of_week: 2,
  doctor_busy: 1,
  current_consultation_remaining: 5
};

const python = spawn(
  process.env.PYTHON_PATH || 'python',
  [script],
  { windowsHide: true }
);

let stdout = '';
let stderr = '';

python.stdout.setEncoding('utf8');
python.stderr.setEncoding('utf8');

python.stdout.on('data', chunk => stdout += chunk);
python.stderr.on('data', chunk => stderr += chunk);

python.on('error', err => {
  console.error('Could not start Python:', err.message);
});

python.on('close', code => {
  console.log('Python exit code:', code);
  if (stderr) console.log('Python stderr:', stderr);
  console.log('Python stdout:', stdout);

  if (code === 0) {
    try {
      console.log('Parsed model result:', JSON.parse(stdout));
    } catch {
      console.log('Output was not valid JSON.');
    }
  }
});

python.stdin.end(JSON.stringify(features));
