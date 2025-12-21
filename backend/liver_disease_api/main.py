from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI(title="Liver Disease Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model & scaler
model = joblib.load("liver_xgb_model.pkl")
scaler = joblib.load("liver_scaler.pkl")

# INPUT SCHEMA (must match training order)
class LiverInput(BaseModel):
    Age: int
    Gender: int          # 1 = Male, 0 = Female
    Total_Bilirubin: float
    Direct_Bilirubin: float
    Alkaline_Phosphotase: float
    Alamine_Aminotransferase: float
    Aspartate_Aminotransferase: float
    Total_Proteins: float
    Albumin: float
    Albumin_and_Globulin_Ratio: float

@app.post("/predict")
def predict_liver(data: LiverInput):

    input_data = np.array([[  
        data.Age,
        data.Gender,
        data.Total_Bilirubin,
        data.Direct_Bilirubin,
        data.Alkaline_Phosphotase,
        data.Alamine_Aminotransferase,
        data.Aspartate_Aminotransferase,
        data.Total_Proteins,
        data.Albumin,
        data.Albumin_and_Globulin_Ratio
    ]])

    scaled = scaler.transform(input_data)
    prediction = model.predict(scaled)[0]
    probability = model.predict_proba(scaled)[0][prediction]

    return {
        "disease": "Liver Disease",
        "risk": "High" if prediction == 1 else "Low",
        "confidence": round(float(probability), 3),
        "explanation": (
            "AI detected indicators suggesting liver dysfunction."
            if prediction == 1
            else
            "AI found no significant indicators of liver disease."
        ),
        "indicators": [
            "Bilirubin levels",
            "Liver enzymes",
            "Protein balance",
            "Albumin ratio"
        ]
    }
