from rest_framework import serializers
from .models import Member, Subscription

class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = '__all__'


class SubscriptionSerializer(serializers.ModelSerializer):
    member_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Subscription
        fields = '__all__'
    
    def get_member_name(self, obj):
        return f"{obj.member.first_name} {obj.member.last_name}"
