
import os
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from predictor import RiskPredictor

if __name__ == "__main__":
    # Initialize predictor
    predictor = RiskPredictor()
    
    # Path to your dataset (replace with actual dataset)
    data_path = 'healthcare_data.csv'
    
    # Train model
    accuracy = predictor.train(data_path)
    print(f"Model trained with accuracy: {accuracy:.2f}")