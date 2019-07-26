# Generated by Django 2.2.2 on 2019-07-26 12:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0028_auto_20190726_1527'),
    ]

    operations = [
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_advanced_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь вспом., кв.м.'),
        ),
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_another_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь прочих, кв.м.'),
        ),
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_balkon_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь балконов, кв.м.'),
        ),
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_general_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь основная (жилая), кв.м.'),
        ),
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_logdi_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь лоджий, кв.м'),
        ),
        migrations.AlterField(
            model_name='explicationlistitem',
            name='square_total_item',
            field=models.DecimalField(blank=True, decimal_places=1, default='', max_digits=5, null=True, verbose_name='Площадь общая, кв.м. -Всего-'),
        ),
    ]
