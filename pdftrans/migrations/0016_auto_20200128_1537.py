# Generated by Django 2.2.2 on 2020-01-28 12:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0015_auto_20200128_1510'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='doc_type',
            field=models.CharField(choices=[('Экспликация на помещение', 'Экспликация на помещение'), ('ТПЖП', 'ТПЖП'), ('Технический паспорт', 'Технический паспорт')], default='Экспликация на помещение', max_length=64, verbose_name='Тип документа'),
        ),
    ]