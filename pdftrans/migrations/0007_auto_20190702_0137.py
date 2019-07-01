# Generated by Django 2.2.2 on 2019-07-01 22:37

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0006_order_object_list'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='order',
            name='customer_adress',
        ),
        migrations.AddField(
            model_name='order',
            name='engineer_name',
            field=models.CharField(max_length=64, null=True, verbose_name='имя инженера'),
        ),
        migrations.AlterField(
            model_name='order',
            name='customer_name',
            field=models.CharField(max_length=64, null=True, verbose_name='имя начальника отделения'),
        ),
        migrations.CreateModel(
            name='Adress',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('subject_rf', models.CharField(max_length=64, null=True, verbose_name='субъект РФ')),
                ('rayon', models.CharField(max_length=64, null=True, verbose_name='Район')),
                ('mun_type', models.CharField(max_length=64, null=True, verbose_name='Муниципальное образование тип')),
                ('mun_name', models.CharField(max_length=64, null=True, verbose_name='Муниципальное образование наименование ')),
                ('city_type', models.CharField(max_length=64, null=True, verbose_name='Населенный пункт тип')),
                ('city_name', models.CharField(max_length=64, null=True, verbose_name='Населенный пункт наименование')),
                ('street', models.CharField(max_length=64, null=True, verbose_name='Улица (проспект, переулок и т. д.)')),
                ('house_number', models.CharField(max_length=64, null=True, verbose_name='Номер дома')),
                ('build_number', models.CharField(max_length=64, null=True, verbose_name='Номер строения')),
                ('corpus_number', models.CharField(max_length=64, null=True, verbose_name='Номер помещения (квартиры)')),
                ('another_places', models.CharField(max_length=64, null=True, verbose_name='Иное описание местоположения')),
                ('order', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.SET_DEFAULT, to='pdftrans.Order', verbose_name='статус заказа')),
            ],
        ),
    ]
