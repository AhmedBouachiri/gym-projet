from django.shortcuts import render
from django.utils import timezone
from datetime import timedelta

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Member, Subscription
from .serializers import MemberSerializer, SubscriptionSerializer
from employees.models import Employee


class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = [permissions.IsAdminUser]


class SubscriptionViewSet(viewsets.ModelViewSet):
    queryset = Subscription.objects.all()
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAdminUser]


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
    """
    Returns dashboard statistics for members and employees.
    """
    now = timezone.now().date()
    expiring_soon_date = now + timedelta(days=7)
    
    members_total = Member.objects.count()
    members_active = Member.objects.filter(is_active=True).count()
    members_expiring_soon = Member.objects.filter(
        end_date__isnull=False,
        end_date__lte=expiring_soon_date,
        end_date__gte=now
    ).count()
    
    subscriptions_active = Subscription.objects.filter(status='active').count()
    subscriptions_expiring = Subscription.objects.filter(status='expiring_soon').count()
    
    employees_total = Employee.objects.count()
    employees_active = Employee.objects.filter(status='active').count()
    
    return Response({
        'members_total': members_total,
        'members_active': members_active,
        'members_expiring_soon': members_expiring_soon,
        'subscriptions_active': subscriptions_active,
        'subscriptions_expiring': subscriptions_expiring,
        'employees_total': employees_total,
        'employees_active': employees_active,
    })

