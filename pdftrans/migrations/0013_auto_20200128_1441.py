# Generated by Django 2.2.2 on 2020-01-28 11:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0012_auto_20200128_1428'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='subj_type',
            field=models.CharField(default='None', max_length=64, verbose_name='субъект РФ'),
        ),
    ]
