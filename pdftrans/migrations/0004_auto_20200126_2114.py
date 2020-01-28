# Generated by Django 2.2.2 on 2020-01-26 18:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0003_order_new_source'),
    ]

    operations = [
        migrations.AddField(
            model_name='adress',
            name='city_name_general',
            field=models.CharField(blank=True, default='Москва', max_length=64, verbose_name='Город - наименование'),
        ),
        migrations.AddField(
            model_name='adress',
            name='city_type_general',
            field=models.CharField(default='', max_length=64, verbose_name='Город - тип'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='city_name',
            field=models.CharField(blank=True, default='', max_length=64, verbose_name='Населенный пункт наименование'),
        ),
    ]
