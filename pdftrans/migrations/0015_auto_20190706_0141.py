# Generated by Django 2.2.2 on 2019-07-05 22:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0014_auto_20190706_0140'),
    ]

    operations = [
        migrations.RenameField(
            model_name='adress',
            old_name='flow_number',
            new_name='floor_number',
        ),
    ]