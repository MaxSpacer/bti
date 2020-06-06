# Generated by Django 2.2.2 on 2020-06-05 20:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('settings_pdftrans', '0003_headerexplication'),
    ]

    operations = [
        migrations.CreateModel(
            name='PriceItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_price_Item', models.CharField(blank=True, max_length=128, null=True)),
                ('cost_price_item', models.PositiveSmallIntegerField(blank=True, default=0, null=True, verbose_name='стоимость услуги, в руб.')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('updated', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Услуга',
                'verbose_name_plural': 'Услуги',
            },
        ),
    ]
