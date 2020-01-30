# Generated by Django 2.2.2 on 2020-01-30 01:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pdftrans', '0017_ordertech'),
    ]

    operations = [
        migrations.AddField(
            model_name='adress',
            name='global_appartment',
            field=models.CharField(blank=True, default='', max_length=8, verbose_name='номер помещения'),
        ),
        migrations.AlterField(
            model_name='order',
            name='doc_type',
            field=models.CharField(choices=[('Экспликация на помещение', 'Экспликация на помещение'), ('Технический паспорт', 'Технический паспорт')], default='Экспликация на помещение', max_length=64, verbose_name='Тип документа'),
        ),
        migrations.AlterField(
            model_name='order',
            name='type_object',
            field=models.CharField(choices=[('Помещение', 'Помещение'), ('j', 'j')], default='Помещение', max_length=64, verbose_name='вид объекта учета'),
        ),
        migrations.AlterField(
            model_name='order',
            name='uploaded_pdf',
            field=models.FileField(blank=True, max_length=250, null=True, upload_to='tech_pasports/', verbose_name='Исходный документ(pdf)'),
        ),
        migrations.DeleteModel(
            name='OrderTech',
        ),
    ]
