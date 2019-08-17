# -*- coding: utf-8 -*-

import os
import json as JSON
import csv as CSV
from django.conf import settings
from decimal import Decimal
from .models import *
# from django.shortcuts import get_object_or_404
from django.dispatch import receiver
from django.db.models.signals import post_save
# from django.template.loader import render_to_string
from django.utils.html import strip_tags
# from importlib import import_module
# from django.conf import settings
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
            row_read = CSV.reader(f)
            for row in row_read:
                pp = (row[0].strip(" '")).split(":")
                adress_item_list = pp[1].split(",")
                print('adress_item_list')
                print(adress_item_list)
            i = 0
            total_list = []
            for item in adress_item_list:
                total_val = adress_item_list[i].split()
                k = ''
                v = ''
                for word in total_val:
                    if word[0].isupper() or word[0].isdigit():
                        v = word
                    else:
                        k = word
                total_list.append([k, v])
                i+=1
            print('total_list')
            print(total_list)
            total_dict = {
                'city_type':'',
                'city_name': '',
                'street_type':'',
                'street':'',
                'micro_rayon':'',
                'house_number':'',
                'corpus_number':'',
                'litera':''
            }
            for item in total_list:
                if item[0] == 'город' or item[0] == 'поселение' or item[0] == 'деревня' or item[0] == 'поселок':
                    k = 'city_type'
                    v = item[0]
                    total_dict.update({k: v})
                    k = 'city_name'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'улица' or item[0] == 'переулок' or item[0] == 'проспект' or item[0] == 'проезд' or item[0] == 'шоссе' or item[0] == 'площадь':
                    k = 'street_type'
                    v = item[0]
                    total_dict.update({k: v})
                    k = 'street'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'микрорайон':
                    k = 'micro_rayon'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'дом':
                    k = 'house_number'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'корпус':
                    k = 'corpus_number'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'litera':
                    k = 'litera'
                    v = item[1]
                    total_dict.update({k: v})

                elif item[0] == 'строение':
                    k = 'build_number'
                    v = item[1]
                    total_dict.update({k: v})

            print('total_dict')
            print(total_dict)
                # func(adress_item_list[i])
            v, created = Adress.objects.update_or_create(
            order=instance,
            defaults=total_dict,
            )

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
    # H = uploaded_pdf_url.split('media')
    # h = H[1]
    # print('-----------h-----------')
    # print(H)
    # print(h)
    # # h.replace("\\","/")
    # print(h)
    #
    #
    # path_img_scheme = os.path.join(settings.MEDIA_ROOT, h)
    # print('path_img_scheme')
    # print(path_img_scheme)
    # 'uploaded_pdf/%Y/%m/%d/    relative_url = instance.uploaded_pdf.url
    # ur = instance.uploaded_pdf.url
    # ur.lstrip('/media/')
    # print('ur')
    # print(ur)
    path_img_name = 'schema_' + instance.order_number + '.png'
    path_img_scheme = os.path.join(settings.MEDIA_ROOT, 'uploaded_pdf/schemes/', path_img_name)
    # path_img_scheme_bd = "%s.png" % (uploaded_pdf_url)
    path_img_scheme_bd = "uploaded_pdf/schemes/%s" % path_img_name
    protocol = Site.objects.get_current().protocoltype
    current_site = Site.objects.get_current().domain
    path_full_pdf = "%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
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
            defaults={'order_image': path_img_scheme_bd, 'fullpdf_url_staff': path_full_pdf }
            )
    # print('instance.adress')
    # print(instance.adress)

    pass
