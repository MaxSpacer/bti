# Generated by Django 2.2.2 on 2020-06-06 00:12

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('settings_pdftrans', '0004_priceitem'),
    ]

    operations = [
        migrations.RenameField(
            model_name='priceitem',
            old_name='name_price_Item',
            new_name='name_price_item',
        ),
    ]
