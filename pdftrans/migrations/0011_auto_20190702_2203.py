# Generated by Django 2.2.2 on 2019-07-02 19:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0010_auto_20190702_2117'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adress',
            name='build_number',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Номер строения'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='city_name',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Населенный пункт наименование'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='corpus_number',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Номер корпуса'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='mun_name',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Муниципальное образование наименование '),
        ),
        migrations.AlterField(
            model_name='adress',
            name='mun_type',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Муниципальное образование тип'),
        ),
        migrations.AlterField(
            model_name='adress',
            name='street',
            field=models.CharField(blank=True, max_length=64, null=True, verbose_name='Улица (проспект, переулок и т. д.)'),
        ),
    ]