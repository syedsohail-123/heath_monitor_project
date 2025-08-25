# api/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Patient
from .serializers import PatientSerializer
from .ml.predictor import RiskPredictor

class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    
    @action(detail=False, methods=['post'])
    def predict_risk(self, request):
        # Extract patient data from request
        patient_data = {
            'age': request.data.get('age'),
            'gender': request.data.get('gender'),
            'height': request.data.get('height'),
            'weight': request.data.get('weight'),
            'blood_pressure': request.data.get('blood_pressure'),
            'cholesterol': request.data.get('cholesterol'),
            'glucose': request.data.get('glucose'),
            'smoking': request.data.get('smoking', False),
            'alcohol': request.data.get('alcohol', False),
            'exercise': request.data.get('exercise', False),
        }
        
        # Create and save patient record
        patient = Patient.objects.create(**patient_data)
        
        # Predict risk
        predictor = RiskPredictor()
        risk_result = predictor.predict(patient_data)
        
        # Return prediction result
        return Response({
            'patient_id': patient.id,
            'risk_prediction': risk_result
        }, status=status.HTTP_201_CREATED)