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
    "https://autism-prediction-rho.vercel.app"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://autism-prediction-rho.vercel.app",]
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------- Input Schema -------------------
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

    # Total A-score
    a_scores = [input_dict[f"A{i}_Score"] for i in range(1, 11)]
    input_dict['result'] = float(sum(a_scores))

    categorical_features = [
        'gender', 'ethnicity', 'jaundice', 'contry_of_res',
        'autism', 'used_app_before', 'relation'
    ]

    for feature in categorical_features:
        value = str(input_dict[feature]).strip()

        # ------------------- Normalize inputs -------------------
        value_lower = value.lower()

        if feature == "gender":
            if value_lower in ["male", "m"]:
                value = "m"
            elif value_lower in ["female", "f"]:
                value = "f"
            else:
                value = "m"  # default fallback

        elif feature in ["jaundice", "autism", "used_app_before"]:
            if value_lower in ["yes", "y"]:
                value = "yes"
            elif value_lower in ["no", "n"]:
                value = "no"
            else:
                value = "no"  # default fallback

        elif feature == "relation":
            # Only 'Self' or 'Others' in training
            if value_lower != "self":
                value = "Others"

        elif feature in ["ethnicity", "contry_of_res"]:
            # Try case-insensitive match to training encoder classes
            found = False
            for cls in encoders[feature].classes_:
                if cls.lower() == value_lower:
                    value = cls
                    found = True
                    break
            if not found:
                value = encoders[feature].classes_[0]  # fallback to first class

        input_dict[feature] = value

        # ------------------- Encode using LabelEncoder -------------------
        if feature in encoders:
            try:
                input_dict[feature] = encoders[feature].transform([value])[0]
            except ValueError:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid value '{value}' for feature '{feature}'. "
                           f"Must be one of trained categories: {list(encoders[feature].classes_)}"
                )
        else:
            raise HTTPException(status_code=500, detail=f"Missing encoder for feature: {feature}")

    # ------------------- Prepare features vector -------------------
    try:
        features_vector = np.array([[input_dict[f] for f in model_features]])
    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Missing expected input feature: {e}")

    # ------------------- Prediction -------------------
    prediction_proba = model.predict_proba(features_vector)[0]
    predicted_class = np.argmax(prediction_proba)
    confidence = prediction_proba[predicted_class]

    label_map = {0: "No Autism Detected", 1: "Autism Spectrum Disorder Detected"}

    return {
        "label": label_map.get(predicted_class, "Unknown"),
        "confidence": float(confidence),
        "prediction_class": int(predicted_class)
    }