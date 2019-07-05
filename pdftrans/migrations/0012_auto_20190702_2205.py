# Generated by Django 2.2.2 on 2019-07-02 19:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0011_auto_20190702_2203'),
    ]

    operations = [
        migrations.AddField(
            model_name='adress',
            name='street_type',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Улица (проспект, переулок и т. д.)'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='another_places',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Иное описание местоположения'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='apart_number',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Номер помещения (квартиры)'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='city_type',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Населенный пункт тип'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='flow_number',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Этаж'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='house_number',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Номер дома'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='rayon',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Район'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='street',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='название улицы (проспекта, переулка и т. д.)'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='subject_rf',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='субъект РФ'),
        ),
    ]
