from django.db import models
from members.models import Member


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
