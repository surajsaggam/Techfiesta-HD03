from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io
import json

app = FastAPI(title="Brain Tumor Prediction API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model
model = tf.keras.models.load_model("brain_tumor_model.h5")

# Load correct class mapping
with open("class_indices.json", "r") as f:
    class_indices = json.load(f)

# Reverse mapping: index → class name
index_to_class = {v: k for k, v in class_indices.items()}

def preprocess_image(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    image_bytes = await file.read()
    img = preprocess_image(image_bytes)

    preds = model.predict(img)[0]
    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))
    predicted_class = index_to_class[class_index]

    return {
        "disease": "Brain Tumor",
        "prediction": predicted_class,
        "confidence": round(confidence, 3)
    }
