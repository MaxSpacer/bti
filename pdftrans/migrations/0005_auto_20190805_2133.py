# Generated by Django 2.2.2 on 2019-08-05 18:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0004_auto_20190805_1748'),
    ]

    operations = [
        migrations.AlterField(
            model_name='explicationlistitem',
            name='appart_name_item',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Характеристики комнат и помещений'),
        ),
    ]
