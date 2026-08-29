from rest_framework import serializers
from .models import Employee


class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = '__all__'
    
    def validate_salary(self, value):
        if value is not None and value < 0:
            raise serializers.ValidationError("Le salaire ne peut pas être négatif.")
        return value
