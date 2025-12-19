from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Heart Disease API")

# Load pipeline
pipeline = joblib.load("heart_pipeline.joblib")

class HeartInput(BaseModel):
    age: int
    sex: str
    cp: str
    trestbps: float
    chol: float
    fbs: int
    restecg: str
    thalach: float
    exang: int
    oldpeak: float
    slope: str
    ca: int
    thal: str

@app.post("/predict")
def predict(data: HeartInput):

    df = pd.DataFrame([{
        "age": data.age,
        "sex": data.sex,
        "cp": data.cp,
        "trestbps": data.trestbps,
        "chol": data.chol,
        "fbs": data.fbs,
        "restecg": data.restecg,
        "thalch": data.thalach,   # dataset column name
        "exang": data.exang,
        "oldpeak": data.oldpeak,
        "slope": data.slope,
        "ca": data.ca,
        "thal": data.thal.replace("_", " ")
    }])

    prediction = pipeline.predict(df)[0]
    probability = pipeline.predict_proba(df)[0][1]

    return {
        "prediction": int(prediction),
        "risk": "High" if prediction == 1 else "Low",
        "confidence": round(probability * 100, 2)
    }
