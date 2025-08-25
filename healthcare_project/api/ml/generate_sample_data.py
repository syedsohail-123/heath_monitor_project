# api/ml/generate_sample_data.py
import pandas as pd
import numpy as np

# Generate synthetic healthcare data
np.random.seed(42)
num_samples = 1000

data = {
    'age': np.random.randint(18, 80, num_samples),
    'gender': np.random.choice(['M', 'F', 'O'], num_samples),
    'height': np.random.normal(170, 10, num_samples),
    'weight': np.random.normal(70, 15, num_samples),
    'blood_pressure': [f"{int(np.random.normal(120, 15))}/{int(np.random.normal(80, 10))}" for _ in range(num_samples)],
    'cholesterol': np.random.randint(150, 300, num_samples),
    'glucose': np.random.randint(70, 200, num_samples),
    'smoking': np.random.choice([True, False], num_samples, p=[0.3, 0.7]),
    'alcohol': np.random.choice([True, False], num_samples, p=[0.4, 0.6]),
    'exercise': np.random.choice([True, False], num_samples, p=[0.6, 0.4]),
}

# Create risk labels based on simple rules
risk = []
for i in range(num_samples):
    score = 0
    
    # Age factor
    if data['age'][i] > 60:
        score += 1
    
    # Blood pressure factor
    systolic, diastolic = map(int, data['blood_pressure'][i].split('/'))
    if systolic > 140 or diastolic > 90:
        score += 1
    
    # Cholesterol factor
    if data['cholesterol'][i] > 240:
        score += 1
    
    # Glucose factor
    if data['glucose'][i] > 140:
        score += 1
    
    # Lifestyle factors
    if data['smoking'][i]:
        score += 1
    if not data['exercise'][i]:
        score += 1
    
    # Determine risk level
    if score <= 1:
        risk.append(0)  # Low
    elif score <= 3:
        risk.append(1)  # Medium
    else:
        risk.append(2)  # High

data['risk'] = risk

# Create DataFrame and save
df = pd.DataFrame(data)
df.to_csv('healthcare_data.csv', index=False)
print("Sample dataset generated and saved to healthcare_data.csv")