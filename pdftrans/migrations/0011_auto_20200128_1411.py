# Generated by Django 2.2.2 on 2020-01-28 11:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0010_auto_20200128_1357'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adress',
            name='subject_rf',
            field=models.CharField(blank=True, default='Москва', max_length=64, verbose_name='субъект РФ'),
        ),
    ]
