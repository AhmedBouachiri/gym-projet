from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    member_name = serializers.ReadOnlyField(source='member.__str__')

    class Meta:
        model = Payment
        fields = '__all__'