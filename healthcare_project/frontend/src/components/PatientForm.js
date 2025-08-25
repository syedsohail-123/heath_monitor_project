// src/components/PatientForm.js
import React, { useState } from 'react';
import { predictRisk } from '../services/api';

const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'M',
    height: '',
    weight: '',
    blood_pressure: '',
    cholesterol: '',
    glucose: '',
    smoking: false,
    alcohol: false,
    exercise: false,
  });
  
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const result = await predictRisk(formData);
      setPrediction(result);
    } catch (err) {
      setError('Failed to predict risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 0: return 'bg-green-100 text-green-800';
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Patient Risk Prediction</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              max="120"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
              <option value="O">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              step="0.1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Pressure</label>
            <input
              type="text"
              name="blood_pressure"
              value={formData.blood_pressure}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="e.g. 120/80"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cholesterol (mg/dL)</label>
            <input
              type="number"
              name="cholesterol"
              value={formData.cholesterol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Glucose (mg/dL)</label>
            <input
              type="number"
              name="glucose"
              value={formData.glucose}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="smoking"
              checked={formData.smoking}
              onChange={handleChange}
              className="h-4 w-4 text-primary rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Smoking</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="alcohol"
              checked={formData.alcohol}
              onChange={handleChange}
              className="h-4 w-4 text-primary rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Alcohol Consumption</label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              name="exercise"
              checked={formData.exercise}
              onChange={handleChange}
              className="h-4 w-4 text-primary rounded"
            />
            <label className="ml-2 text-sm text-gray-700">Regular Exercise</label>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {loading ? 'Predicting...' : 'Predict Risk'}
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {prediction && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Risk Prediction Results</h2>
          
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(prediction.risk_prediction.risk_level)}`}>
              {prediction.risk_prediction.risk_label} Risk
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-sm font-medium text-gray-700">Low Risk Probability:</span>
              <span className="ml-2 text-sm text-gray-900">
                {(prediction.risk_prediction.risk_probabilities[0] * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">Medium Risk Probability:</span>
              <span className="ml-2 text-sm text-gray-900">
                {(prediction.risk_prediction.risk_probabilities[1] * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">High Risk Probability:</span>
              <span className="ml-2 text-sm text-gray-900">
                {(prediction.risk_prediction.risk_probabilities[2] * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>Patient ID: {prediction.patient_id}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientForm;