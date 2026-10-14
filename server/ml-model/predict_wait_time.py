import sys
import json
import joblib
import pandas as pd
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "aiq_d001_wait_time_model.pkl"

FEATURES = [
    "patients_ahead",
    "avg_consultation_time_ahead",
    "total_consultation_time_ahead",
    "max_consultation_time_ahead",
    "long_cases_ahead",
    "priority_patients_ahead",
    "hour_of_day",
    "day_of_week",
    "doctor_busy",
    "current_consultation_remaining",
]

def main():
    data = json.load(sys.stdin)

    model = joblib.load(MODEL_PATH)
    input_df = pd.DataFrame(
        [{feature: data[feature] for feature in FEATURES}],
        columns=FEATURES,
    )

    prediction = float(model.predict(input_df)[0])

    print(json.dumps({
        "predicted_wait_minutes": round(max(0, prediction), 2),
        "model_version": "RF-1.0",
    }))

if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(json.dumps({"error": str(exc)}), file=sys.stderr)
        sys.exit(1)