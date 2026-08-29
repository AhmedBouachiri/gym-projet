from django.db import models
from members.models import Member

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('Cash', 'Cash'),
        ('Card', 'Credit/Debit Card'),
        ('Transfer', 'Bank Transfer'),
    ]

    STATUS_CHOICES = [
        ('Completed', 'Completed'),
        ('Pending', 'Pending'),
        ('Failed', 'Failed'),
    ]

    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHOD_CHOICES, default='Card')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Completed')

    def __str__(self):
        return f"Payment #{self.id} - {self.member.first_name} {self.member.last_name} (${self.amount})"
