# Generated by Django 2.2.2 on 2020-06-04 23:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0045_auto_20200605_0216'),
    ]

    operations = [
        migrations.AlterField(
            model_name='order',
            name='header_object',
            field=models.ForeignKey(blank=True, default=1, null=True, on_delete=django.db.models.deletion.SET_NULL, to='settings_pdftrans.HeaderExplication'),
        ),
    ]
