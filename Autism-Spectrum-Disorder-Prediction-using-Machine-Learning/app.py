from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import os
import pickle

# ------------------- Load Model and Encoders -------------------
MODEL_FILE = "best_model.pkl"
ENCODERS_FILE = "encoders.pkl"
FEATURES_FILE = "model_features.pkl"

if not os.path.exists(MODEL_FILE) or not os.path.exists(ENCODERS_FILE) or not os.path.exists(FEATURES_FILE):
    raise FileNotFoundError("Required files missing. Run the notebook first.")

model = joblib.load(MODEL_FILE)

with open(ENCODERS_FILE, "rb") as f:
    encoders = pickle.load(f)

with open(FEATURES_FILE, "rb") as f:
    model_features = pickle.load(f)

# ------------------- FastAPI Setup -------------------
app = FastAPI(title="ASD Prediction API")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Pydantic Input Schema -------------------
class Payload(BaseModel):
    age: int = Field(..., ge=1, le=100)
    gender: str
    ethnicity: str
    jaundice: str
    contry_of_res: str
    autism: str
    used_app_before: str
    relation: str
    A1_Score: int = Field(..., ge=0, le=1)
    A2_Score: int = Field(..., ge=0, le=1)
    A3_Score: int = Field(..., ge=0, le=1)
    A4_Score: int = Field(..., ge=0, le=1)
    A5_Score: int = Field(..., ge=0, le=1)
    A6_Score: int = Field(..., ge=0, le=1)
    A7_Score: int = Field(..., ge=0, le=1)
    A8_Score: int = Field(..., ge=0, le=1)
    A9_Score: int = Field(..., ge=0, le=1)
    A10_Score: int = Field(..., ge=0, le=1)

# ------------------- Home Endpoint -------------------
@app.get("/")
def home():
    return {"message": "ASD Prediction API is running!"}

# ------------------- Prediction Endpoint -------------------
@app.post("/api/predict")
def predict_asd(data: Payload):
    input_dict = data.model_dump()

    # Calculate 'result' dynamically
    a_scores = [input_dict[f"A{i}_Score"] for i in range(1, 11)]
    input_dict['result'] = float(sum(a_scores))

    # Encode categorical features
    categorical_features = ['gender', 'ethnicity', 'jaundice', 'contry_of_res', 'autism', 'used_app_before', 'relation']
    for feature in categorical_features:
        value = input_dict[feature].strip()
        if feature in encoders:
            try:
                input_dict[feature] = encoders[feature].transform([value])[0]
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for feature '{feature}'. Must be one of trained categories."
                )
        else:
            raise HTTPException(status_code=500, detail=f"Missing encoder for feature: {feature}")

    # Ensure feature order matches training
    try:
        features_vector = np.array([[input_dict[f] for f in model_features]])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing expected input feature: {e}")

    # Prediction
    prediction_proba = model.predict_proba(features_vector)[0]
    predicted_class = np.argmax(prediction_proba)
    confidence = prediction_proba[predicted_class]

    label_map = {0: "No Autism Detected", 1: "Autism Spectrum Disorder Detected"}

    return {
        "label": label_map.get(predicted_class, "Unknown"),
        "confidence": float(confidence),
        "prediction_class": int(predicted_class)
    }
