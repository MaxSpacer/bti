# Generated by Django 2.2.2 on 2019-07-01 22:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0008_auto_20190702_0139'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='customer_data',
            field=models.DateTimeField(verbose_name='дата документа'),
        ),
        migrations.AlterField(
            model_name='order',
            name='customer_name',
            field=models.CharField(default='Панин В.Э.', max_length=64, null=True, verbose_name='имя начальника отделения'),
        ),
        migrations.AlterField(
            model_name='order',
            name='engineer_name',
            field=models.CharField(default='Клименко М.В.', max_length=64, null=True, verbose_name='имя инженера'),
        ),
    ]
