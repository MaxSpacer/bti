# -*- coding: utf-8 -*-

import os
import qrcode
import random
import barcode
import datetime
from PIL import Image, ImageDraw, ImageFont
from barcode import generate
from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.files import File
from settings_pdftrans.models import *
from barcode.writer import ImageWriter
from django.contrib.sites.models import Site
from django.core.validators import MaxValueValidator
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy


def get_subject_type_choices():
    SUBJECT_TYPE_CHOICES = [(str(e.subject_type), e.subject_type) for e in SubjectType.objects.all()]
    return SUBJECT_TYPE_CHOICES


def get_subject_type_default():
    def_value = SubjectType.objects.filter().first()
    default = str(def_value)
    return default

def get_doc_type_choices():
    DOC_TYPE_CHOICES = [(str(e.docs_type), e.docs_type) for e in DocType.objects.all()]
    return DOC_TYPE_CHOICES

def get_doc_type_default():
    def_value = DocType.objects.filter().first()
    default = str(def_value)
    return default

def get_type_object_choices():
    TYPE_OBJECT_CHOICES = [(str(e.objects_type), e.objects_type) for e in TypeObject.objects.all()]
    return TYPE_OBJECT_CHOICES

def get_type_object_default():
    def_value = TypeObject.objects.filter().first()
    default = str(def_value)
    return default

def get_name_object_default():
    def_value = NameObject.objects.filter().first()
    default = str(def_value)
    return default


class Order(models.Model):
    order_number = models.PositiveSmallIntegerField(blank=True, null=True, default = 0)
    uploaded_pdf = models.FileField(verbose_name="Исходный документ(pdf)", upload_to='uploaded_pdf/', blank=True, null=True, max_length=250)
    customer_data = models.DateTimeField(verbose_name="дата документа", auto_now_add=False, auto_now=False, default=timezone.now)
    subj_type = models.CharField(verbose_name="субъект РФ", max_length=64, choices=get_subject_type_choices(), default=get_subject_type_default())
    doc_type = models.CharField(verbose_name="Тип документа", max_length=64, choices=get_doc_type_choices(), default=get_doc_type_default())
    type_object = models.CharField(verbose_name="вид объекта учета", max_length=64, choices=get_type_object_choices(), default=get_type_object_default())
    header_object = models.ForeignKey(HeaderExplication, on_delete=models.SET_DEFAULT, blank=True, null=True,default=1)
    barcode = models.ImageField(blank=True, null=True, upload_to='barcode/')
    qrcode = models.ImageField(blank=True, null=True, upload_to='qrcode/')
    width_image_schema = models.IntegerField('Размер схемы %', blank=True, null=True,validators=[MaxValueValidator(100)], default=30)
    engineer_name = models.CharField(verbose_name="имя инженера", default="Клименко М.В.", max_length=64, blank=False, null=True)
    customer_name = models.CharField(verbose_name="имя начальника отделения", default="Панин В.Э.", max_length=64, blank=False, null=True)
    kadastr_number = models.CharField(verbose_name="кадастровый номер комнат", default="", max_length=64, blank=True, null=True)
    is_emailed = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

     # def get_draft(self):
     #    return self.cashitog_set.filter(type="3")

    def get_itog_url(self):
        current_site = Site.objects.get_current().domain
        prefix = settings.WEB_PROTOCOL_STRING
        if self.subj_type == 'Москва':
            path_full_pdf = "%s%s%s" % (prefix, current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': self.pk}))
        elif self.subj_type == 'Московская область':
            path_full_pdf = "%s%s%s" % (prefix, current_site, reverse_lazy('pdftrans:order_mo_full_pdf_view_n', kwargs={'pk': self.pk}))
        return path_full_pdf

    def get_order_adress(self):
        f = Adress.objects.get(order = self)
        return f
        # pass
    def generate_qr_bar_code(self):
        print(self.doc_type)
        # v = str(random.randint(1000000000, 2147483645))
        uniq_random_time_number = datetime.datetime.now().strftime('%f%S%M')
        print(uniq_random_time_number)
        ### barcode generating
        barcode_file_name = "bar_%s" % uniq_random_time_number
        barcode_full_path = os.path.join(settings.MEDIA_ROOT, 'barcode', str(barcode_file_name + '.png'))
        barcode_path = os.path.join(settings.MEDIA_ROOT, 'barcode', barcode_file_name)
        barcode_path_for_bd = "barcode/%s.png" % barcode_file_name

        ISBN = barcode.get_barcode_class('isbn10')
        ean = ISBN(uniq_random_time_number, writer=ImageWriter())
        ean.save(barcode_path, options = {'text_distance':3, 'quiet_zone':5.5, 'module_height':4,'font_size':0})
        #
        # ima = Image.open(barcode_full_path)
        # ima = ima.resize((160,25))
        # ima.save(barcode_full_path)
        # barcode_formated = Image.new('1', (550, 25,), color=1)
        # box = (0, 0, 160, 25)
        # region = ima.crop(box)
        # barcode_formated.paste(region, (0,0))
        #
        # i = 0
        # space = " "
        # barcode_text = str()
        # for x in uniq_random_time_number:
        #     if (i == 2 or i == 4):
        #         barcode_text = barcode_text + ' '
        #         print(barcode_text)
        #     barcode_text = barcode_text + uniq_random_time_number[i]
        #     i+=1
        #
        # barcode_text_font = os.path.join(settings.STATIC_ROOT, 'fonts', 'times.ttf')
        # fnt = ImageFont.truetype(barcode_text_font, 15)
        # d = ImageDraw.Draw(barcode_formated)
        # d.text((460,3), barcode_text, font=fnt, fill=(0))
        # barcode_formated.save(barcode_full_path)

        ### qrcode generating
        qrcode_file_name = "qr_%s.png" % uniq_random_time_number
        qrcode_full_path = os.path.join(settings.MEDIA_ROOT, 'qrcode', qrcode_file_name)
        qrcode_path_for_bd = "qrcode/%s" % qrcode_file_name
        qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_L,
        box_size=12,
        border=0,
        )
        domain = Site.objects.get_current().domain
        domain_MO = get_object_or_404(Site, pk = 2)
        data_url = 'https://{domain}/get-order-info/qr/{name}'.format(domain=domain, name=uniq_random_time_number)
        if self.subj_type == 'Московская область':
            data_url = 'https://{domain}/uslugi/prover-document/'.format(domain=domain_MO)
        qr.add_data(data_url)
        qr.make(fit=True)
        img = qr.make_image()
        img.save(qrcode_full_path)
        self.qrcode = (qrcode_path_for_bd)
        self.barcode = (barcode_path_for_bd)
        self.order_number = uniq_random_time_number


    def __str__(self):
        return "Ордер № %s %s" % (self.id, self.order_number)

    def __init__(self,  *args, **kwargs):
        self._meta.get_field('subj_type').default = SubjectType.objects.filter().first()
        self._meta.get_field('doc_type').default = DocType.objects.filter().first()
        self._meta.get_field('type_object').default = TypeObject.objects.filter().first()
        # self._meta.get_field('name_object').default = NameObject.objects.filter().first()
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
    # fullpdf_url_staff = models.URLField(max_length=250, blank=True, null=False)
    floor_for_image = models.CharField(verbose_name="план этажа", max_length=32, blank=True, null=True, default='')
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return "%s" % self.order_image

    class Meta:
        verbose_name = 'схема помещения на этаже'
        verbose_name_plural = 'схемы помещений'


class OrderTech(models.Model):
    order_tech_fk = models.ForeignKey(Order, on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name='Тех.паспорт ордера')
    order_tech_pasp_pdf = models.FileField('Тех.паспорт', blank=True, null=True, max_length=250)
    tech_pasp_pdf_url = models.URLField(max_length=250, blank=True, null=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return "%s" % self.tech_pasp_pdf_url

    class Meta:
        verbose_name = 'Тех.паспорт'
        verbose_name_plural = 'Тех.паспорта'


class Adress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, default=None, verbose_name = 'статус заказа')
    rayon = models.CharField(verbose_name="Район", max_length=128, blank=True, null=False, default = '')
    mun_type = models.CharField(verbose_name="Муниципальное образование тип", max_length=64, blank=True, null=False, default = '')
    mun_name = models.CharField(verbose_name="Муниципальное образование наименование ", max_length=64, blank=True, null=False, default = '')
    city_type = models.CharField(verbose_name="Населенный пункт тип", max_length=64, default='')
    city_name = models.CharField(verbose_name="Населенный пункт наименование", max_length=64, blank=True, null=False, default = '')
    street_type = models.CharField(verbose_name="Улица (проспект, переулок и т. д.)", max_length=64, blank=True, default='')
    street = models.CharField(verbose_name="название улицы (проспекта, переулка и т. д.)", max_length=64, blank=True, null=False, default = '')
    house_number = models.CharField(verbose_name="Номер дома", max_length=64, blank=True, null=False, default = '')
    corpus_number = models.CharField(verbose_name="Номер корпуса", max_length=64, blank=True, null=False, default = '')
    litera = models.CharField(verbose_name="Литера", max_length=64, blank=True, null=False, default = '')
    build_number = models.CharField(verbose_name="Номер строения", max_length=64, blank=True, null=False, default = '')
    another_places = models.CharField(verbose_name="Иное описание местоположения", max_length=64, blank=True, null=False, default = '')
    full_adress = models.CharField(verbose_name="полный адрес", max_length=256, blank=True, null=False, default = '')
    global_appartment_type = models.CharField(verbose_name="тип помещения", max_length=64, blank=True, null=False, default = '')
    global_appartment = models.CharField(verbose_name="номер помещения", max_length=8, blank=True, null=False, default = '')
    sub_appartment_type = models.CharField(verbose_name="тип подпомещения", max_length=64, blank=True, null=False, default = '')
    sub_appartment = models.CharField(verbose_name="номер подпомещения", max_length=32, blank=True, null=False, default = '')
    qtyroom = models.CharField(verbose_name="кол-во комнат для МО", max_length=16, blank=True, null=False, default = '')

    class Meta:
        verbose_name = 'Адрес'
        verbose_name_plural = 'Адреc'

    def get_second_part_full_adress(self):
        if self.sub_appartment_type:
            ret_string = self.global_appartment_type +' № '+ self.global_appartment + ', ' + self.sub_appartment_type +' '+ self.sub_appartment
        else:
            ret_string = self.global_appartment_type +' № '+ self.global_appartment
        return ret_string

    def get_full_adress(self):
        if self.full_adress:
            return_address_string = self.full_adress + self.get_second_part_full_adress()
        return return_address_string


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


class CashItog(models.Model):
    order_otof = models.OneToOneField(Order, on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name='Чек')
    order_price = models.ForeignKey(PriceItem, on_delete=models.CASCADE, blank=True, null=True, default=None)
    cash_url = models.CharField(max_length=250 ,blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return "%s" % self.order_price

    def get_cost_on_price(self):
        cost = self.order_price.cost_price_item
        return cost

    def __init__(self,  *args, **kwargs):
        super(CashItog, self).__init__(*args, **kwargs)

    class Meta:
        verbose_name = 'Чек'
        verbose_name_plural = 'Чеки'
