# Generated by Django 2.2.2 on 2019-06-30 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0003_auto_20190630_1324'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='barcode',
            field=models.ImageField(blank=True, null=True, upload_to='barcode/'),
        ),
    ]
