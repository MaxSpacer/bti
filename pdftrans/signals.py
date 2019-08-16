# -*- coding: utf-8 -*-

import os
import json as JSON
import csv as CSV
from django.conf import settings
from decimal import Decimal
from .models import *
from django.shortcuts import get_object_or_404
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from importlib import import_module
from django.conf import settings
from django.core import serializers
import camelot
import fitz
from django.urls import reverse_lazy
# from io import StringIO


@receiver(post_save, sender=Order)
def export_data_pdf(sender, instance, created, **kwargs):
    uploaded_pdf_url = instance.uploaded_pdf.path

    address = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['170,720,780,700'])
    csv_address_f = os.path.join(settings.MEDIA_ROOT, 'temp', 'csv_address.csv')
    csv = address[0].to_csv(csv_address_f)
    if csv_address_f:
        with open(csv_address_f, 'r', encoding='utf-8') as f:
            print("------------data-------------------")
            total_dict = {
            'город': '',
            'деревня': '',
            'село': '',
            'поселок': '',
            'поселение': '',
            'переулок': '',
            'микрорайон': '',
            'проспект': '',
            'село': '',
            'проезд': '',
            'шоссе': '',
            'площадь': '',
            'улица': '',
            'дом': '',
            'корпус': '',
            'строение': '',
            'литера': ''
            }
            def func(string_value):
                for key, value in total_dict.items():
                    if key in string_value:
                        total_val = string_value.split()
                        print('total_val')
                        print(total_val)

                        total_val.remove(key)
                        total_val = total_val[0]
                        total_dict.update({key: total_val})
                        print(total_dict)
                pass
            row_read = CSV.reader(f)
            for row in row_read:
                pp = (row[0].strip(" '")).split(":")
                adress_item_list = pp[1].split(",")
                print('adress_item_list')
                print(adress_item_list)
            i = 0
            for item in adress_item_list:
                func(adress_item_list[i])
                # v, created = Adress.objects.update_or_create(
                # order=instance,
                # defaults={
                # 'subject_rf':square_general_sum,
                # 'rayon':square_advanced_sum,
                # 'mun_type':square_logdi_sum,
                # 'mun_name':square_balkon_sum,
                # 'city_type':square_another_sum,
                # 'city_name': square_total_sum,
                # 'street_type':square_total_sum,
                # 'street':square_general_sum,
                # 'micro_rayon':square_advanced_sum,
                # 'house_number':square_logdi_sum,
                # 'corpus_number':square_balkon_sum,
                # 'litera':square_another_sum
                # },
                # )
                i+=1

            # print(instance.adress)

    tables = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9)
    json_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table.json')
    json = tables[0].to_json(json_table)
    if json_table:
        with open(json_table, 'r') as f:
            print("------------data-------------------")
            data = JSON.load(f)
            ExplicationListItem.objects.filter(order_list=instance).delete()
            i = 0
            data.pop()
            for x in data:
                if i == 0:
                    local_appart = x["1"]
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
            # print('-+-+-+-+-+-+-+-+-+-+-+-+-+-+')
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
    # print (tables[0].parsing_report)
    # print (tables[0].df)
    # print('--------------doc--------------')
    path_img_scheme = "%s-%s.png" % (uploaded_pdf_url, instance.order_number)
    protocol = Site.objects.get_current().protocoltype
    current_site = Site.objects.get_current().domain
    path_full_pdf = "%s%s%s" % (protocol, current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
    doc = fitz.open(uploaded_pdf_url)
    for i in range(len(doc)):
        for img in doc.getPageImageList(i):
            xref = img[0]
            print(xref)
            pix = fitz.Pixmap(doc, xref)
            if pix.n < 5:       # this is GRAY or RGB
                pix.writePNG(path_img_scheme)
            else:               # CMYK: convert to RGB first
                pix1 = fitz.Pixmap(fitz.csRGB, pix)
                pix1.writePNG(path_img_scheme)
                pix1 = None
            pix = None
            order_img_clear = OrderImage.objects.filter(order_fk=instance).delete()
            v, created = OrderImage.objects.update_or_create(
            order_fk=instance,
            defaults={'order_image': path_img_scheme, 'fullpdf_url_staff': path_full_pdf }
            )
    # print('instance.adress')
    # print(instance.adress)

    pass
