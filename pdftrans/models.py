
import os
import qrcode
import barcode
import random
from django.db import models
from django.conf import settings
from django.core.files import File
from barcode import generate
from barcode.writer import ImageWriter



class Order(models.Model):
    engineer_name = models.CharField(verbose_name="имя инженера", default="Клименко М.В.", max_length=64, blank=False, null=True)
    customer_name = models.CharField(verbose_name="имя начальника отделения", default="Панин В.Э.", max_length=64, blank=False, null=True)
    object_list = models.CharField(verbose_name="cписок объектов", max_length=64, blank=False, null=True)
    customer_data = models.DateTimeField(verbose_name="дата документа", auto_now_add=False, auto_now=False)
    image = models.ImageField('схема помещения',upload_to='schema_images/')
    image_2 = models.ImageField('таблица экспликации',upload_to='explications_images/')
    barcode = models.ImageField(blank=True, null=True, upload_to='barcode/')
    qrcode = models.ImageField(blank=True, null=True, upload_to='qrcode/')
    order_number = models.IntegerField(blank=True, null=True, default = 0)
    is_active = models.BooleanField('активен?',default=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    def generate_qr_bar_code(self):
        v = str(random.randint(1000000000000, 9999999999999))
        bar_file_name = "bar_%s" % v
        qr_file_name = "qr_%s.png" % v
        barcode_full_path = os.path.join(settings.MEDIA_ROOT, 'barcode', bar_file_name)
        barcode_path_for_bd = "barcode/%s.png" % bar_file_name
        qrcode_full_path = os.path.join(settings.MEDIA_ROOT, 'qrcode', qr_file_name)
        qrcode_path_for_bd = "qrcode/%s" % qr_file_name

        EAN = barcode.get_barcode_class('ean13')
        ean = EAN(v, writer=ImageWriter())
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

    def __str__(self):
        return "Ордер № %s %s" % (self.id, self.customer_adress)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def save(self, *args, **kwargs):
        if self.order_number:
            pass
        else:
            self.generate_qr_bar_code()
        super(Order, self).save(*args, **kwargs)


class Adress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.SET_DEFAULT, null=True, default=None, verbose_name = 'статус заказа')
    subject_rf = models.CharField(verbose_name="субъект РФ", max_length=64, blank=False, null=True)
    rayon = models.CharField(verbose_name="Район", max_length=64, blank=False, null=True)
    mun_type = models.CharField(verbose_name="Муниципальное образование тип", max_length=64, blank=False, null=True)
    mun_name = models.CharField(verbose_name="Муниципальное образование наименование ", max_length=64, blank=False, null=True)
    city_type = models.CharField(verbose_name="Населенный пункт тип", max_length=64, blank=False, null=True)
    city_name = models.CharField(verbose_name="Населенный пункт наименование", max_length=64, blank=False, null=True)
    street = models.CharField(verbose_name="Улица (проспект, переулок и т. д.)", max_length=64, blank=False, null=True)
    house_number = models.CharField(verbose_name="Номер дома", max_length=64, blank=False, null=True)
    corpus_number = models.CharField(verbose_name="Номер корпуса", max_length=64, blank=False, null=True)
    build_number = models.CharField(verbose_name="Номер строения", max_length=64, blank=False, null=True)
    corpus_number = models.CharField(verbose_name="Номер помещения (квартиры)", max_length=64, blank=False, null=True)
    another_places = models.CharField(verbose_name="Иное описание местоположения", max_length=64, blank=False, null=True)
