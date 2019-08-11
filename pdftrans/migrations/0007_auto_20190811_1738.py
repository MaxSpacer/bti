# Generated by Django 2.2.2 on 2019-08-11 14:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0006_adress_floor_number_adress'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='floor_number_order',
            field=models.CharField(blank=True, max_length=64, verbose_name='Этаж'),
        ),
        migrations.AddField(
            model_name='order',
            name='height_item_order',
            field=models.CharField(blank=True, max_length=5, null=True, verbose_name='Высота помешения'),
        ),
        migrations.AddField(
            model_name='order',
            name='is_update',
            field=models.BooleanField(default=False, verbose_name='обновлен?'),
        ),
    ]
