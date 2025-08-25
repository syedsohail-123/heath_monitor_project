// src/App.js
import React from 'react';
import PatientForm from './components/PatientForm';
function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Healthcare Risk Prediction</h1>
          <p className="text-gray-600 mt-2">Predict patient health risks using machine learning</p>
        </header>
        
        <PatientForm />
      </div>
    </div>
  );
}

export default App;
