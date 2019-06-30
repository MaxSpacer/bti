
import os
import qrcode
# from io import StringIO
# from io import BytesIO
from django.db import models
# from django.urls import reverse
# from django.core.files.uploadedfile import InMemoryUploadedFile
from django.conf import settings
from django.core.files import File


class Order(models.Model):
    customer_name = models.CharField(verbose_name="имя инженера", max_length=64, blank=False, null=True)
    customer_adress = models.TextField(verbose_name="адрес помещения", blank=False, null=True)
    customer_data = models.DateTimeField(auto_now_add=False, auto_now=False)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)
    is_active = models.BooleanField('активен?',default=True)
    image = models.ImageField('схема помещения',upload_to='schema_images/')
    image_2 = models.ImageField('таблица экспликации',upload_to='explications_images/')
    qrcode = models.ImageField(blank=True, null=True, upload_to='qrcode/')

    # def get_absolute_url(self):
    #     return reverse('pdftrans:order_detail_n', args=[str(self.id)])

    def generate_qrcode(self):
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_L,
            box_size=12,
            border=0,
        )
        print("-----------------------------")
        print(self.id)
        qr.add_data('some test text')
        qr.make(fit=True)
        img = qr.make_image()
        filename = "evts.png"
        save_path = os.path.join(settings.MEDIA_ROOT, 'qrcode', filename)
        save_path_for_bd = "qrcode/%s" % filename
        img.save(save_path)
        # print(img.path())
        # filebuffer = InMemoryUploadedFile(
        #     buffer, None, filename, 'image/png', buffer.len, None)
        # self.qrcode.save(filename, img, save=False)
        # with open(settings.MEDIA_ROOT + filename, "rb") as reopen:
        # with open(save_path, "rb") as reopen:
        #     django_file = File(reopen)
        #     print(filename)
        self.qrcode = (save_path_for_bd)
    # customer_data = PhoneNumberField(verbose_name="ваш телефон", blank=False, null=True)

    # customer_phone = PhoneNumberField(verbose_name="ваш телефон", blank=False, null=True)

    # customer_comments = models.TextField(verbose_name="комментарии к заказу", blank=True, null=True, default=None)
    # total_price_order = models.DecimalField(verbose_name = 'общая сумма заказа', max_digits=10, decimal_places=2, default=0) #total_price in order for all products
    # status = models.ForeignKey(Status_order, on_delete=models.SET_DEFAULT, default=1, verbose_name = 'статус заказа')
    # is_emailed = models.BooleanField(default=False)
    # order_session_key = models.CharField(max_length=128, blank=True, null=True, default=None)


    def __str__(self):
        return "Ордер № %s %s" % (self.id, self.customer_adress)

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'

    def save(self, *args, **kwargs):
        self.generate_qrcode()
        super(Order, self).save(*args, **kwargs)
