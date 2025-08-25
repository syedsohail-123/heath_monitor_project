// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/';

export const predictRisk = async (patientData) => {
  try {
    const response = await axios.post(`${API_URL}patients/predict_risk/`, patientData);
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};