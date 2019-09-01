# -*- coding: utf-8 -*-

import os
import qrcode
import barcode
import random
from django.db import models
from django.conf import settings
from django.core.files import File
from barcode import generate
from barcode.writer import ImageWriter
from django.core.validators import MaxValueValidator
from django.contrib.sites.models import Site
from django.utils import timezone
from settings_pdftrans.models import *

def get_doc_type_choices():
    DOC_TYPE_CHOICES = [(str(e.docs_type), e.docs_type) for e in DocType.objects.all()]
    return DOC_TYPE_CHOICES

# def get_doc_type_default():
#     default = DocType.objects.filter().first()
#     return default

def get_type_object_choices():
    TYPE_OBJECT_CHOICES = [(str(e.objects_type), e.objects_type) for e in TypeObject.objects.all()]
    return TYPE_OBJECT_CHOICES

# def get_type_object_default():
#     default = TypeObject.objects.filter().first()
#     return default

def get_name_object_choices():
    NAME_OBJECT_CHOICES = [(str(e.objects_name), e.objects_name) for e in NameObject.objects.all()]
    return NAME_OBJECT_CHOICES

# def get_name_object_default():
#     default = NameObject.objects.filter().first()
#     return default

# self._meta.get_field('name_object').choices = get_name_object_choices()
# self._meta.get_field('name_object').default = NameObject.objects.filter().first()

class Order(models.Model):
    order_number = models.PositiveIntegerField(blank=True, null=True, default = 0)
    uploaded_pdf = models.FileField(verbose_name="Исходный документ(pdf)", upload_to='uploaded_pdf/%Y/%m/%d/', blank=True, null=True, max_length=250)
    customer_data = models.DateTimeField(verbose_name="дата документа", auto_now_add=False, auto_now=False, default=timezone.now)
    doc_type = models.CharField(verbose_name="Тип документа", max_length=64, choices=get_doc_type_choices())
    type_object = models.CharField(verbose_name="вид объекта учета", max_length=64, choices=get_type_object_choices())
    name_object = models.CharField(verbose_name="наименование объекта учета", max_length=64, choices=get_name_object_choices())
    barcode = models.ImageField(blank=True, null=True, upload_to='barcode/')
    qrcode = models.ImageField(blank=True, null=True, upload_to='qrcode/')
    width_image_schema = models.IntegerField('Размер схемы %', blank=True, null=True,validators=[MaxValueValidator(100)], default=50)
    engineer_name = models.CharField(verbose_name="имя инженера", default="Клименко М.В.", max_length=64, blank=False, null=True)
    customer_name = models.CharField(verbose_name="имя начальника отделения", default="Панин В.Э.", max_length=64, blank=False, null=True)
    is_emailed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)



    def generate_qr_bar_code(self):
        v = str(random.randint(1000000000, 2147483645))
        bar_file_name = "bar_%s" % v
        qr_file_name = "qr_%s.png" % v
        barcode_full_path = os.path.join(settings.MEDIA_ROOT, 'barcode', bar_file_name)
        barcode_path_for_bd = "barcode/%s.png" % bar_file_name
        qrcode_full_path = os.path.join(settings.MEDIA_ROOT, 'qrcode', qr_file_name)
        qrcode_path_for_bd = "qrcode/%s" % qr_file_name

        ISBN = barcode.get_barcode_class('isbn10')
        ean = ISBN(v, writer=ImageWriter())
        print(ean)
        ean.save(barcode_full_path)

        qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=12,
        border=0,
        )
        domain = Site.objects.get_current().domain
        data_url = 'http://{domain}/get-order-info/qr/{name}'.format(domain=domain, name=v)
        qr.add_data(data_url)
        qr.make(fit=True)
        img = qr.make_image()
        img.save(qrcode_full_path)
        self.qrcode = (qrcode_path_for_bd)
        self.barcode = (barcode_path_for_bd)
        self.order_number = v

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def __str__(self):
        return "Ордер № %s %s" % (self.id, self.order_number)

    def __init__(self,  *args, **kwargs):

        self._meta.get_field('doc_type').default = DocType.objects.filter().first()

        self._meta.get_field('type_object').default = TypeObject.objects.filter().first()

        self._meta.get_field('name_object').default = NameObject.objects.filter().first()


        super(Order, self).__init__(*args, **kwargs)

    def save(self, *args, **kwargs):
        if self.order_number:
            pass
        else:
            self.generate_qr_bar_code()
        super(Order, self).save(*args, **kwargs)


class OrderImage(models.Model):
    order_fk = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name='Ордер')
    order_image = models.ImageField('схема помещения', blank=True, null=True, max_length=250)
    fullpdf_url_staff = models.URLField(max_length=250, blank=True, null=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return "%s" % self.order_image

    class Meta:
        verbose_name = 'схема помещения'
        verbose_name_plural = 'схемы помещений'


class Adress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, default=None, verbose_name = 'статус заказа')
    subject_rf = models.CharField(verbose_name="субъект РФ", max_length=64, blank=True, null=False, default = 'Москва')
    rayon = models.CharField(verbose_name="Район", max_length=64, blank=True, null=False, default = '')
    mun_type = models.CharField(verbose_name="Муниципальное образование тип", max_length=64, blank=True, null=False, default = '')
    mun_name = models.CharField(verbose_name="Муниципальное образование наименование ", max_length=64, blank=True, null=False, default = '')
    city_type = models.CharField(verbose_name="Населенный пункт тип", max_length=64, default='')
    city_name = models.CharField(verbose_name="Населенный пункт наименование", max_length=64, blank=True, null=False, default = 'Москва')
    street_type = models.CharField(verbose_name="Улица (проспект, переулок и т. д.)", max_length=64, default='')
    street = models.CharField(verbose_name="название улицы (проспекта, переулка и т. д.)", max_length=64, blank=True, null=False, default = '')
    micro_rayon = models.CharField(verbose_name="микрорайон", max_length=64, blank=True, null=False, default = '')
    house_number = models.CharField(verbose_name="Номер дома", max_length=64, blank=True, null=False, default = '')
    corpus_number = models.CharField(verbose_name="Номер корпуса", max_length=64, blank=True, null=False, default = '')
    litera = models.CharField(verbose_name="Литера", max_length=64, blank=True, null=False, default = '')
    build_number = models.CharField(verbose_name="Номер строения", max_length=64, blank=True, null=False, default = '')
    another_places = models.CharField(verbose_name="Иное описание местоположения", max_length=64, blank=True, null=False, default = '')

    def __str__(self):
        if self.corpus_number:
            corpus_str = ", корпус %s" % (self.corpus_number)
        else: corpus_str = ""
        if self.build_number:
            build_str = ", строение %s" % (self.build_number)
        else: build_str = ""
        if self.micro_rayon:
            micro_ray = ", микрорайон %s" % (self.micro_rayon)
        else: micro_ray = ""
        if self.litera:
            lit = ", литера %s" % (self.litera)
        else: lit = ""
        return "%s %s%s, %s %s, дом %s%s%s%s" % (self.city_type, self.city_name, micro_ray, self.street, self.street_type, self.house_number, corpus_str, build_str, lit)

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреc'


class ExplicationListItem(models.Model):
    order_list = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name='g')
    appart_number_item = models.CharField(verbose_name="№№ комнат", max_length=3, blank=True, null=False)
    appart_name_item = models.CharField(verbose_name="Характеристики комнат и помещений", max_length=64, blank=True, null=True)
    square_total_item = models.CharField(verbose_name="Площадь общая, кв.м. -Всего-", max_length=5, blank=True, null=True)
    square_general_item = models.CharField(verbose_name="Площадь основная (жилая), кв.м.", max_length=5, blank=True, null=True)
    square_advanced_item = models.CharField(verbose_name="Площадь вспом., кв.м.", max_length=5, blank=True, null=True)
    square_logdi_item = models.CharField(verbose_name="Площадь лоджий, кв.м", max_length=5, blank=True, null=True)
    square_balkon_item = models.CharField(verbose_name="Площадь балконов, кв.м.", max_length=5, blank=True, null=True)
    square_another_item = models.CharField(verbose_name="Площадь прочих, кв.м.", max_length=5, blank=True, null=True)
    floor_number = models.CharField(verbose_name="Этаж", max_length=64, blank=True, null=False)
    height_item = models.CharField(verbose_name="Высота помешения", max_length=5, blank=True, null=True)
    apart_number = models.CharField(verbose_name="Номер помещения (квартиры)", max_length=64, blank=True, null=False)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'ряд таблицы экспликации'
        verbose_name_plural = 'Таблица экспликации'


class ExplicationSquareTotal(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, blank=True, null=True, default=None)
    square_total_summa_global = models.DecimalField(verbose_name="Общая площадь ( с летними ):", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_total_summa = models.DecimalField(verbose_name="Площадь общая, кв.м. -Всего- Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_general_summa = models.DecimalField(verbose_name="Площадь основная (жилая), кв.м. Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_advanced_summa = models.DecimalField(verbose_name="Площадь вспом., кв.м. Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_logdi_summa = models.DecimalField(verbose_name="Площадь лоджий, кв.м. Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_balkon_summa = models.DecimalField(verbose_name="Площадь балконов, кв.м. Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)
    square_another_summa = models.DecimalField(verbose_name="Площадь прочих, кв.м. Итого:", max_digits=5, decimal_places=1, blank=True, null=True, default=0.0)

    class Meta:
        verbose_name = 'Общая площадь помещений'
        verbose_name_plural = 'Общие площади помещений'

    def __str__(self):
        return "Итоговые площади к %s" % self.order
