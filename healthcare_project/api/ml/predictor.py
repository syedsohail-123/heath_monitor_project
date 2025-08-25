# api/ml/predictor.py
import os
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib


class RiskPredictor:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_columns = [
            'age', 'gender', 'height', 'weight', 'systolic',
            'diastolic', 'cholesterol', 'glucose', 'smoking',
            'alcohol', 'exercise'
        ]

        # Save all artifacts in the same folder as this file
        self.base_dir = os.path.dirname(__file__)
        self.model_path = os.path.join(self.base_dir, "model.pkl")
        self.scaler_path = os.path.join(self.base_dir, "scaler.pkl")

    def train(self, data_path):
        # Load dataset
        df = pd.read_csv(data_path)

        # Preprocess data
        df['gender'] = df['gender'].map({'M': 0, 'F': 1, 'O': 2})
        df[['systolic', 'diastolic']] = df['blood_pressure'].str.split('/', expand=True).astype(int)
        df = df.drop('blood_pressure', axis=1)

        X = df[self.feature_columns]
        y = df['risk']  # Risk column (0: low, 1: medium, 2: high)

        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        # Scale features
        self.scaler = StandardScaler()
        X_train_scaled = self.scaler.fit_transform(X_train)

        # Train model
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X_train_scaled, y_train)

        # Save model and scaler in api/ml/
        joblib.dump(self.model, self.model_path)
        joblib.dump(self.scaler, self.scaler_path)

        return self.model.score(self.scaler.transform(X_test), y_test)

    def load_model(self):
        self.model = joblib.load(self.model_path)
        self.scaler = joblib.load(self.scaler_path)

    def predict(self, patient_data):
        if self.model is None or self.scaler is None:
            self.load_model()

        # Convert patient data to DataFrame
        df = pd.DataFrame([patient_data])

        # Preprocess
        df['gender'] = df['gender'].map({'M': 0, 'F': 1, 'O': 2})
        df[['systolic', 'diastolic']] = df['blood_pressure'].str.split('/', expand=True).astype(int)
        df = df.drop('blood_pressure', axis=1)

        # Ensure all feature columns are present
        for col in self.feature_columns:
            if col not in df.columns:
                df[col] = 0

        # Scale and predict
        X = df[self.feature_columns]
        X_scaled = self.scaler.transform(X)

        risk_probabilities = self.model.predict_proba(X_scaled)[0]
        risk_level = np.argmax(risk_probabilities)

        return {
            'risk_level': int(risk_level),
            'risk_probabilities': risk_probabilities.tolist(),
            'risk_label': ['Low', 'Medium', 'High'][risk_level]
        }
