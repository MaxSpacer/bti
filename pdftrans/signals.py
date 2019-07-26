# -*- coding: utf-8 -*-
from decimal import Decimal
from .models import Order, ExplicationListItem, ExplicationSquareTotal
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags
# from orders.models import
from importlib import import_module
from django.conf import settings

@receiver(post_save, sender=Order)
def update_explication_square_total_on_create(sender, instance, created, **kwargs):
        explication_list_item = ExplicationListItem.objects.filter(order_list=instance.pk)
        print(explication_list_item)
        square_total_sum = Decimal("0.0")
        square_general_sum = Decimal("0.0")
        square_advanced_sum = Decimal("0.0")
        square_logdi_sum = Decimal("0.0")
        square_balkon_sum = Decimal("0.0")
        square_another_sum = Decimal("0.0")

        for items in explication_list_item:
            if items.square_total_item !=None:
                # print(items.square_total_item)
                square_total_sum += items.square_total_item
            if items.square_general_item !=None:
                # print(items.square_general_item)
                square_general_sum += items.square_general_item
            if items.square_advanced_item !=None:
                # print(items.square_advanced_item)
                square_advanced_sum += items.square_advanced_item
            if items.square_logdi_item !=None:
                # print(items.square_logdi_item)
                square_logdi_sum += items.square_logdi_item
            if items.square_balkon_item !=None:
                # print(items.square_balkon_item)
                square_balkon_sum += items.square_balkon_item
            if items.square_another_item !=None:
                # print(items.square_another_item)
                square_another_sum += items.square_another_item

        print(
            square_total_sum,
            square_general_sum,
            square_advanced_sum,
            square_logdi_sum,
            square_balkon_sum,
            square_another_sum
        )
        print("=================")
        print(instance)
        print(instance.pk)

        obj, created = ExplicationSquareTotal.objects.get_or_create(
        order=instance,
        square_total_summa=square_total_sum,
        square_general_summa=square_general_sum,
        square_advanced_summa=square_advanced_sum,
        square_logdi_summa=square_logdi_sum,
        square_balkon_summa=square_balkon_sum,
        square_another_summa=square_another_sum
        )
        if not created:
            obj.square_total_summa=square_total_sum
            obj.square_general_summa=square_general_sum
            obj.square_advanced_summa=square_advanced_sum
            obj.square_logdi_summa=square_logdi_sum
            obj.square_balkon_summa=square_balkon_sum
            obj.square_another_summa=square_another_sum
            print ("not created")
            obj.save(force_update=True)

        # context = {
		#     'order_name': instance.customer_name,
		#     'order_number': instance.pk,
		#     'order_adress': instance.customer_adress,
		#     'contact_phone': instance.customer_phone,
		#     'contact_comments': instance.customer_comments,
		#     'total_price_order': instance.total_price_order,
		#     # 'basket_order': instance,
		# }
        # context["basket_order"] = list()
        # for item in products_in_basket:
        #     product_dict = dict()
        #     # product_dict["id"] = item.id
        #     product_dict["product_name"] = item.pb_product.name
        #     product_dict["price_per_item"] = item.pb_price_per_item
        #     product_dict["numb"] = item.pb_qty
        #     product_dict["total_price"] = item.pb_total_price
        #     # product_dict["products_in_basket_total_price"] = item.pb_total_price
        #     context["basket_order"].append(product_dict)
        #
        #
        # print(products_in_basket)
        # print(context)
        # subject = 'Заказ № %s' % instance.pk
        # html_message = render_to_string('mail_templates/mail_template_eduorder.html', context)
        # plain_message = strip_tags(html_message)
        # from_email = 'info@doxaih.ru'
        # to = 'zakaz@doxaih.ru'
        # if instance.is_emailed == False:
        #     if subject and html_message and from_email:
        #         try:
        #             if send_mail(subject, plain_message, from_email, [to], html_message=html_message):
        #                 Order.objects.filter(pk=instance.pk).update(is_emailed=True)
        #                 instance.is_emailed = True
        #         except BadHeaderError:
        #             return print('Invalid header found in email %s' % instance.pk)
        #         return print('email is sended %s' % instance.pk)
        #     else:
    	#         return print('Make sure all fields are entered and valid %s' % instance.pk)
