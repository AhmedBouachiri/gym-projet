# Generated migration for Employee model

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.CharField(max_length=100)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('role', models.CharField(choices=[('coach', 'Coach'), ('reception', 'Accueil'), ('manager', 'Manager'), ('maintenance', 'Entretien')], max_length=20)),
                ('status', models.CharField(choices=[('active', 'Actif'), ('on_leave', 'En congé'), ('inactive', 'Inactif')], default='active', max_length=20)),
                ('hire_date', models.DateField()),
                ('salary', models.DecimalField(blank=True, decimal_places=2, max_digits=8, null=True)),
                ('address', models.CharField(blank=True, max_length=255, null=True)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
