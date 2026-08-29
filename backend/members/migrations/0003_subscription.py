# Generated migration for Subscription model

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0002_member_end_date'),
    ]

    operations = [
        migrations.CreateModel(
            name='Subscription',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subscription_type', models.CharField(choices=[('monthly', 'Mensuel'), ('quarterly', 'Trimestriel'), ('annual', 'Annuel'), ('day_pass', 'Accès jour')], max_length=20)),
                ('status', models.CharField(choices=[('active', 'Actif'), ('expiring_soon', 'Expire bientôt'), ('expired', 'Expiré')], default='active', max_length=20)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField()),
                ('price', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
                ('notes', models.TextField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subscriptions', to='members.member')),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
