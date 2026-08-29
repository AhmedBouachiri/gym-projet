from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MemberViewSet, SubscriptionViewSet, dashboard_stats

router = DefaultRouter()
router.register(r'members', MemberViewSet)
router.register(r'subscriptions', SubscriptionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/stats/', dashboard_stats, name='dashboard-stats'),
]
