# api/models.py
from django.db import models

class Patient(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    ]
    
    name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES)
    height = models.FloatField(help_text="Height in cm")
    weight = models.FloatField(help_text="Weight in kg")
    blood_pressure = models.CharField(max_length=7, help_text="e.g. 120/80")
    cholesterol = models.IntegerField()
    glucose = models.IntegerField()
    smoking = models.BooleanField(default=False)
    alcohol = models.BooleanField(default=False)
    exercise = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name