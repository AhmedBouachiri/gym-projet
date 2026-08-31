# Generated migration for Member model end_date field

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('members', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='member',
            name='end_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
