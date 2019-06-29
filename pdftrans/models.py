from django.db import models

# Create your models here.
class Order(models.Model):

    customer_name = models.CharField(verbose_name="имя инженера", max_length=64, blank=False, null=True)
    customer_adress = models.TextField(verbose_name="адрес помещения", blank=False, null=True)
    customer_data = models.DateTimeField(auto_now_add=False, auto_now=False)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)
    is_active = models.BooleanField('активен?',default=True)
    image = models.ImageField('схема помещения',upload_to='schema_images/')
    image_2 = models.ImageField('таблица экспликации',upload_to='explications_images/')

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
        super(Order, self).save(*args, **kwargs)
