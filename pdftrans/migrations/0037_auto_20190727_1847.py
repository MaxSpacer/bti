# Generated by Django 2.2.2 on 2019-07-27 15:47

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0036_auto_20190727_1701'),
    ]

    operations = [
        migrations.AlterField(
            model_name='explicationsquaretotal',
            name='order',
            field=models.OneToOneField(blank=True, default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='pdftrans.Order'),
        ),
    ]
