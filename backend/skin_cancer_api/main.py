from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
import numpy as np
from PIL import Image
import io

# ================= APP =================
app = FastAPI(title="Skin Cancer Prediction API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= LOAD MODEL =================
model = tf.keras.models.load_model("skin_cancer_model.h5")
print(model.summary())

# ================= CONFIG =================
IMG_SIZE = 128  # 🔥 FIXED (based on model architecture)

# TEMP class names (until friend confirms exact order)
CLASS_NAMES = [
    "actinic_keratosis",
    "basal_cell_carcinoma",
    "benign_keratosis",
    "dermatofibroma",
    "melanoma",
    "nevus",
    "squamous_cell_carcinoma",
    "vascular_lesion",
    "unknown"
]

# ================= PREPROCESS =================
def preprocess_image(image: Image.Image):
    image = image.convert("RGB")
    image = image.resize((IMG_SIZE, IMG_SIZE))
    image = np.array(image) / 255.0
    image = np.expand_dims(image, axis=0)  # (1, 128, 128, 3)
    return image

# ================= API =================
@app.post("/predict-image")
async def predict_image(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents))

    img = preprocess_image(image)

    preds = model.predict(img)
    class_index = int(np.argmax(preds))
    confidence = float(np.max(preds))

    return {
        "disease": "Skin Cancer",
        "prediction": CLASS_NAMES[class_index],
        "confidence": round(confidence, 3)
    }
