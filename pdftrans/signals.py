# -*- coding: utf-8 -*-

import os
import json as JSON
from django.conf import settings
from decimal import Decimal
from .models import Order, ExplicationListItem, ExplicationSquareTotal, Adress
from django.shortcuts import get_object_or_404
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from importlib import import_module
from django.conf import settings
from django.core import serializers
import camelot

@receiver(post_save, sender=Order)
def export_data_pdf(sender, instance, created, **kwargs):
    tables = camelot.read_pdf(instance.uploaded_pdf.path, flavor='stream', row_tol=9)
    # print("---table2-----")
    # tables2 = camelot.read_pdf(instance.uploaded_pdf.path, flavor='stream', table_areas=['100,720,500,700'],column_tol = 100)
    # csv_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'csv_table.csv')
    # json = tables2[0].to_csv(csv_table)
    # print (tables2[0].parsing_report)
    # print (tables2[0].df)
    # print("---table2end-----")
    json_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table.json')
    # csv_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table.csv')
    json = tables[0].to_json(json_table)
    # json = tables[0].to_csv(csv_table)
    if json_table:
        with open(json_table, 'r') as f:
            print("------------data-------------------")
            data = JSON.load(f)
            ExplicationListItem.objects.filter(order_list=instance).delete()
            i = 0
            data.pop()
            for x in data:
                # print(x)
                if i == 0:
                    local_appart = x["1"]
                # if i > 4:
                if i > 4 and x['0'] != '':
                    ExplicationListItem.objects.create(
                    order_list = instance,
                    floor_number = x['0'],
                    appart_number_item = x['1'],
                    appart_name_item = x['2'],
                    square_total_item = x['3'],
                    square_general_item = x['4'],
                    square_advanced_item = x['5'],
                    square_logdi_item = x['6'],
                    square_balkon_item = x['7'],
                    square_another_item = x['8'],
                    height_item = x['9'],
                    apart_number = local_appart
                    )
                i += 1
            print('-+-+-+-+-+-+-+-+-+-+-+-+-+-+')
            explication_list_items = ExplicationListItem.objects.filter(order_list=instance)
            def string_to_correct_decimal(string):
                result = Decimal(string.strip(" '"))
                return result
            square_total_sum = Decimal("0.0")
            square_general_sum = Decimal("0.0")
            square_advanced_sum = Decimal("0.0")
            square_logdi_sum = Decimal("0.0")
            square_balkon_sum = Decimal("0.0")
            square_another_sum = Decimal("0.0")
            square_total_sum_global = Decimal("0.0")

            for items in explication_list_items:
                if items.square_total_item:
                    square_total_sum += string_to_correct_decimal(items.square_total_item)
                    # print(square_total_sum)
                if items.square_general_item:
                    square_general_sum += string_to_correct_decimal(items.square_general_item)
                    # print(square_general_sum)
                if items.square_advanced_item:
                    square_advanced_sum += string_to_correct_decimal(items.square_advanced_item)
                    # print(square_advanced_sum)
                if items.square_logdi_item:
                    square_logdi_sum += string_to_correct_decimal(items.square_logdi_item)
                    # print(square_logdi_sum)
                if items.square_balkon_item:
                    square_balkon_sum += string_to_correct_decimal(items.square_balkon_item)
                    # print(square_balkon_sum)
                if items.square_another_item:
                    square_another_sum += string_to_correct_decimal(items.square_another_item)
                    # print(square_another_sum)

                v, created = ExplicationSquareTotal.objects.update_or_create(
                order=instance,
                defaults={
                'square_total_summa':square_total_sum,
                'square_general_summa':square_general_sum,
                'square_advanced_summa':square_advanced_sum,
                'square_logdi_summa':square_logdi_sum,
                'square_balkon_summa':square_balkon_sum,
                'square_another_summa':square_another_sum,
                'square_total_summa_global': square_total_sum + square_logdi_sum + square_balkon_sum + square_another_sum
                },
                )
    print (tables[0].parsing_report)
    print (tables[0].df)
    pass
