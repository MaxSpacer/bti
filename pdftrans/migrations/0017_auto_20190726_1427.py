# Generated by Django 2.2.2 on 2019-07-26 11:27

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0016_auto_20190726_1406'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='explicationlistitem',
            options={'verbose_name': 'ряд таблицы экспликации', 'verbose_name_plural': 'Таблица экспликации'},
        ),
        migrations.RemoveField(
            model_name='explicationlistitem',
            name='is_active',
        ),
    ]