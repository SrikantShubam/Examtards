# Generated by Django 5.0 on 2023-12-25 10:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_patternfile'),
    ]

    operations = [
        migrations.AddField(
            model_name='exam',
            name='important_dates',
            field=models.TextField(blank=True, null=True),
        ),
    ]
