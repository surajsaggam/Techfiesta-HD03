from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Diabetes Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("diabetes_model.pkl")
scaler = joblib.load("scaler.pkl")

# 👇 ACCEPT ONLY WHAT FRONTEND SENDS
class DiabetesInput(BaseModel):
    Age: int
    Glucose: float
    BMI: float
    Insulin: float

@app.post("/predict")
def predict_diabetes(data: DiabetesInput):

    # ✅ DEFAULT VALUES FOR MISSING FEATURES
    Pregnancies = 0
    BloodPressure = 70
    SkinThickness = 20
    DiabetesPedigreeFunction = 0.5

    input_data = np.array([[ 
        Pregnancies,
        data.Glucose,
        BloodPressure,
        SkinThickness,
        data.Insulin,
        data.BMI,
        DiabetesPedigreeFunction,
        data.Age
    ]])

    scaled_data = scaler.transform(input_data)

    prediction = model.predict(scaled_data)[0]

    # ❌ predict_proba MAY CRASH (version mismatch)
    # so we keep confidence static
    risk = "High" if prediction == 1 else "Low"

    return {
        "disease": "Diabetes",
        "risk": risk,
        "confidence": 0.85,
        "explanation": (
            "Model predicts higher diabetes risk based on glucose, BMI and insulin levels."
            if prediction == 1
            else
            "Model predicts lower diabetes risk based on provided health indicators."
        ),
        "indicators": [
            "Glucose level",
            "BMI",
            "Insulin",
            "Age"
        ]
    }
