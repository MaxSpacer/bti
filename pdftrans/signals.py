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

@receiver(post_save, sender=ExplicationListItem)
def update_explication_square_total_on_create(sender, instance, created, **kwargs):
    explication_list_items = ExplicationListItem.objects.filter(order_list=instance.order_list)
    square_total_sum = Decimal("0.0")
    square_general_sum = Decimal("0.0")
    square_advanced_sum = Decimal("0.0")
    square_logdi_sum = Decimal("0.0")
    square_balkon_sum = Decimal("0.0")
    square_another_sum = Decimal("0.0")

    for items in explication_list_items:
        if items.square_total_item !=None:
            square_total_sum += items.square_total_item
            # print(square_total_sum)
        if items.square_general_item !=None:
            square_general_sum += items.square_general_item
            # print(square_general_sum)
        if items.square_advanced_item !=None:
            square_advanced_sum += items.square_advanced_item
            # print(square_advanced_sum)
        if items.square_logdi_item !=None:
            square_logdi_sum += items.square_logdi_item
            # print(square_logdi_sum)
        if items.square_balkon_item !=None:
            square_balkon_sum += items.square_balkon_item
            # print(square_balkon_sum)
        if items.square_another_item !=None:
            square_another_sum += items.square_another_item
            # print(square_another_sum)

    v, created = ExplicationSquareTotal.objects.update_or_create(
    order=instance.order_list,
    defaults={
    'square_total_summa':square_total_sum,
    'square_general_summa':square_general_sum,
    'square_advanced_summa':square_advanced_sum,
    'square_logdi_summa':square_logdi_sum,
    'square_balkon_summa':square_balkon_sum,
    'square_another_summa':square_another_sum
    },
    )
