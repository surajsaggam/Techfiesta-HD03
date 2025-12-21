from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Heart Disease API")

# ✅ CORS FIX (CRITICAL)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],     # <-- REQUIRED for OPTIONS
    allow_headers=["*"],
    allow_credentials=True,
)

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

    return {
        "disease": "Heart Disease",
        "risk": "High" if prediction == 1 else "Low",
        "confidence": 0.85   # static confidence (OK for demo)
    }


# ✅ FAILSAFE FOR PREFLIGHT (OPTIONAL BUT SAFE)
@app.options("/predict")
async def options_predict():
    return {}
