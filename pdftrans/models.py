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
from .choices import *
from django.core.validators import MaxValueValidator


class SpecAppartListItem(models.Model):
    spec_appart_text = models.CharField(verbose_name="Хар-ка помещения", max_length=64, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    def __str__(self):
        return "%s" % self.spec_appart_text

    class Meta:
        # app_label = 'auth'
        verbose_name = 'хар-ка помещений'
        verbose_name_plural = 'xар-ки помещений'


class Order(models.Model):
    order_number = models.PositiveIntegerField(blank=True, null=True, default = 0)
    customer_data = models.DateTimeField(verbose_name="дата документа", auto_now_add=False, auto_now=False)
    doc_type = models.CharField(verbose_name="Тип документа", max_length=64, choices=DOC_TYPE_CHOICES, default=2)
    image = models.ImageField('схема помещения',upload_to='schema_images/')
    barcode = models.ImageField(blank=True, null=True, upload_to='barcode/')
    qrcode = models.ImageField(blank=True, null=True, upload_to='qrcode/')
    width_image_schema = models.IntegerField('Размер схемы %',blank=True, null=True,validators=[MaxValueValidator(100)], default=50)
    engineer_name = models.CharField(verbose_name="имя инженера", default="Клименко М.В.", max_length=64, blank=False, null=True)
    customer_name = models.CharField(verbose_name="имя начальника отделения", default="Панин В.Э.", max_length=64, blank=False, null=True)
    is_active = models.BooleanField('активен?',default=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

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
        data_url = "http://127.0.0.1:8000/get-order-info/qr/%s" % v
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


    def save(self, *args, **kwargs):
        if self.order_number:
            pass
        else:
            self.generate_qr_bar_code()
        super(Order, self).save(*args, **kwargs)


class Adress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.SET_DEFAULT, null=True, default=None, verbose_name = 'статус заказа')
    subject_rf = models.CharField(verbose_name="субъект РФ", max_length=64, blank=True, null=False)
    rayon = models.CharField(verbose_name="Район", max_length=64, blank=True, null=False)
    mun_type = models.CharField(verbose_name="Муниципальное образование тип", max_length=64, blank=True, null=False)
    mun_name = models.CharField(verbose_name="Муниципальное образование наименование ", max_length=64, blank=True, null=False)
    city_type = models.CharField(verbose_name="Населенный пункт тип", max_length=64, choices=RELEVANCE_CHOICES, default=1)
    city_name = models.CharField(verbose_name="Населенный пункт наименование", max_length=64, blank=True, null=False)
    street_type = models.CharField(verbose_name="Улица (проспект, переулок и т. д.)", max_length=64, choices=GEO_TYPE_CHOICES, default=1)
    street = models.CharField(verbose_name="название улицы (проспекта, переулка и т. д.)", max_length=64, blank=True, null=False)
    house_number = models.CharField(verbose_name="Номер дома", max_length=64, blank=True, null=False)
    corpus_number = models.CharField(verbose_name="Номер корпуса", max_length=64, blank=True, null=False)
    litera = models.CharField(verbose_name="Литера", max_length=64, blank=True, null=False)
    build_number = models.CharField(verbose_name="Номер строения", max_length=64, blank=True, null=False)
    apart_number = models.CharField(verbose_name="Номер помещения (квартиры)", max_length=64, blank=True, null=False)
    floor_number = models.CharField(verbose_name="Этаж", max_length=64, blank=True, null=False)
    height_item = models.IntegerField(verbose_name="Высота помешения", blank=True, null=True)
    another_places = models.CharField(verbose_name="Иное описание местоположения", max_length=64, blank=True, null=False,default=None)

    def __str__(self):
        if self.corpus_number:
            corpus_str = ", корпус %s" % (self.corpus_number)
        else: corpus_str = ""
        if self.build_number:
            build_str = ", строение %s" % (self.build_number)
        else: build_str = ""
        return "%s %s, %s %s, дом %s%s%s" % (self.city_type, self.city_name, self.street, self.street_type, self.house_number, corpus_str, build_str)

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреc'


class ExplicationListItem(models.Model):
    order_list = models.ForeignKey(Order, on_delete=models.SET_DEFAULT, blank=True, null=True, default=None, verbose_name='g')
    appart_number_item = models.CharField(verbose_name="№№ комнат", max_length=3, blank=True, null=False)
    appart_name_item = models.CharField(verbose_name="Характеристики комнат и помещений", max_length=64, blank=True, null=True)
    square_total_item = models.DecimalField(verbose_name="Площадь общая, кв.м. -Всего-", max_digits=5, decimal_places=1, blank=True, null=True)
    square_general_item = models.DecimalField(verbose_name="Площадь основная (жилая), кв.м.", max_digits=5, decimal_places=1, blank=True, null=True)
    square_advanced_item = models.DecimalField(verbose_name="Площадь вспом., кв.м.", max_digits=5, decimal_places=1, blank=True, null=True)
    square_logdi_item = models.DecimalField(verbose_name="Площадь лоджий, кв.м", max_digits=5, decimal_places=1, blank=True, null=True)
    square_balkon_item = models.DecimalField(verbose_name="Площадь балконов, кв.м.", max_digits=5, decimal_places=1, blank=True, null=True)
    square_another_item = models.DecimalField(verbose_name="Площадь прочих, кв.м.", max_digits=5, decimal_places=1, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'ряд таблицы экспликации'
        verbose_name_plural = 'Таблица экспликации'

    def __init__(self,  *args, **kwargs):
        def get_menu_choices():
            SPECS_APPART_CHOICES = [(str(e.spec_appart_text), e.spec_appart_text) for e in SpecAppartListItem.objects.all()]
            return SPECS_APPART_CHOICES
        self._meta.get_field('appart_name_item').choices = get_menu_choices()
        super(ExplicationListItem, self).__init__(*args, **kwargs)


class ExplicationSquareTotal(models.Model):
    order = models.OneToOneField(Order, on_delete=models.SET_DEFAULT, blank=True, null=True, default=None)
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
