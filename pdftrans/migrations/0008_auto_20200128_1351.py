# Generated by Django 2.2.2 on 2020-01-28 10:51

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0007_auto_20200128_1349'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adress',
            name='street_type',
            field=models.CharField(default='', max_length=64, verbose_name='Улица (проспект, переулок и т. д.)'),
        ),
    ]