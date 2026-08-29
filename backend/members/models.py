from django.db import models
from django.utils import timezone
from datetime import timedelta

class Member(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    join_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"


class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Actif'),
        ('expiring_soon', 'Expire bientôt'),
        ('expired', 'Expiré'),
    ]
    
    TYPE_CHOICES = [
        ('monthly', 'Mensuel'),
        ('quarterly', 'Trimestriel'),
        ('annual', 'Annuel'),
        ('day_pass', 'Accès jour'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='subscriptions')
    subscription_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    start_date = models.DateField()
    end_date = models.DateField()
    price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.member.first_name} {self.member.last_name} - {self.get_subscription_type_display()}"
    
    class Meta:
        ordering = ['-created_at']
