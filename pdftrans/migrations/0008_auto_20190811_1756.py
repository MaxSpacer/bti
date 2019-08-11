# Generated by Django 2.2.2 on 2019-08-11 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0007_auto_20190811_1738'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adress',
            name='apart_number',
        ),
        migrations.RemoveField(
            model_name='adress',
            name='floor_number_adress',
        ),
        migrations.RemoveField(
            model_name='order',
            name='floor_number_order',
        ),
        migrations.RemoveField(
            model_name='order',
            name='height_item_order',
        ),
        migrations.AddField(
            model_name='explicationlistitem',
            name='apart_number',
            field=models.CharField(blank=True, max_length=64, verbose_name='Номер помещения (квартиры)'),
        ),
        migrations.AlterField(
            model_name='order',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='schema_images/', verbose_name='схема помещения'),
        ),
    ]
