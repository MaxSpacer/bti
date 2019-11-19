# -*- coding: utf-8 -*-

import os
import json as JSON
import csv as CSV
from django.conf import settings
from decimal import Decimal
from .models import *
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.utils.html import strip_tags
from django.core.mail import BadHeaderError
import requests
from django.core import serializers
import camelot
import sys, fitz
from django.urls import reverse_lazy
from django.template.loader import render_to_string
from unidecode import unidecode
from weasyprint import HTML, CSS
from weasyprint.fonts import FontConfiguration
from django_weasyprint.utils import django_url_fetcher
from django.core.mail import EmailMultiAlternatives
from PIL import Image, ImageChops


@receiver(post_save, sender=Order)
def export_data_pdf(sender, instance, created, **kwargs):
    uploaded_pdf_url = instance.uploaded_pdf.path
    # address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,780,680'])
    address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,400,680'])
    csv_address_f = os.path.join(settings.MEDIA_ROOT, 'temp', 'csv_address.csv')
    csv = address_string[0].to_csv(csv_address_f)
    if csv_address_f:
        with open(csv_address_f, 'r', encoding='utf-8') as f:
            row_read = CSV.reader(f)
            for row in row_read:
                pp = (row[0].strip(" '")).split(":")
                if 'Квартира' in pp[0]:
                    hh = [int(s) for s in pp[0].split() if s.isdigit()]
                    global_appartment = hh[0]
                    print(global_appartment)
                else:
                    print('pp')
                    print(pp)
                    print(pp[1])
                    adress_item_list = pp[1].split(",")
                    print('adress_item_list')
                    print(adress_item_list)
            i = 0
            total_list = []
            for item in adress_item_list:
                k = ''
                v = ''
                total_val = adress_item_list[i].split()
                for word in total_val:
                    if word[0].isupper() or word[0].isdigit():
                        v = word
                    else:
                        k = word
                if i == 1:
                    v = adress_item_list[i].strip()

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

                elif item[0] == 'улица' or item[0] == 'ул.' or item[0] == 'переулок' or item[0] == 'пер.' or item[0] == 'проспект' or item[0] == 'просп.' or item[0] == 'проезд' or item[0] == 'шоссе' or item[0] == 'площадь' or item[0] == 'наб.' or item[0] == 'набережная' or item[0] == 'бульвар' or item[0] == 'бул.':
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
    if instance.new_source:
        tables = camelot.read_pdf(uploaded_pdf_url)
    else:
        tables = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,680,780,100'])

    print(tables[0])
    print(tables[0].parsing_report)
    print(tables[0].df)

    json_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table.json')
    json_table2 = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table2.csv')
    json = tables[0].to_json(path=json_table)
    # json1 = tables[0].to_csv(path=json_table2, orient = 'records', lines = 'True')
    if json_table:
        with open(json_table, 'r') as f:
            print("------------data-------------------")
            data = JSON.load(f)
            ExplicationListItem.objects.filter(order_list=instance).delete()
            i = 0
            data.pop()
            for x in data:
                if i > 2 and x['9'] != '':
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
                    apart_number = global_appartment
                    )
                i += 1
            explication_list_items = ExplicationListItem.objects.filter(order_list=instance)
            def string_to_correct_decimal(string):
                print('string')
                print(string)
                result = Decimal(string.strip(" '").replace(',', '.'))
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
    path_img_name = 'schema_' + str(instance.order_number) + '.png'
    path_img_scheme = os.path.join(settings.MEDIA_ROOT, 'uploaded_pdf/schemes/', path_img_name)
    path_img_scheme_bd = "uploaded_pdf/schemes/%s" % path_img_name
    current_site = Site.objects.get_current().domain
    path_full_pdf = "http://%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
    doc = fitz.open(uploaded_pdf_url)
    i = 0
    for page in doc:                            # iterate through the pages
        if i == 1:
            zoom = 2    # zoom factor
            mat = fitz.Matrix(zoom, zoom)
            pix = page.getPixmap(matrix = mat, alpha = False)     # render page to an image
            pix.writePNG(path_img_scheme)    # store image as a PNG
            def trim(im):
                bg = Image.new(im.mode, im.size, im.getpixel((0,0)))
                diff = ImageChops.difference(im, bg)
                diff = ImageChops.add(diff, diff, 2.0, -100)
                bbox = diff.getbbox()
                if bbox:
                    return im.crop(bbox)
            im = Image.open(path_img_scheme)
            im = trim(im)
            im.save(path_img_scheme)
            order_img_clear = OrderImage.objects.filter(order_fk=instance).delete()
            v, created = OrderImage.objects.update_or_create(
            order_fk=instance,
            defaults={'order_image': path_img_scheme_bd, 'fullpdf_url_staff': path_full_pdf }
            )
        i+=1

    # sending email method -=send_mail=-
    path_full_pdf_for_email = str(path_full_pdf)
    path_full_link_site = 'http://' + str(current_site) + '/get-order-info/' + str(instance.pk)
    context = {
    'order_number': instance.order_number,
    'link_doc': path_full_pdf,
    'link_site': path_full_link_site,
    }
    str_for_traslit = unidecode(str(instance.adress))
    subject = str_for_traslit + ' - Док №: ' + str(instance.order_number)
    from_email = 'btireestrexpress@yandex.ru'
    to = 'btireestrexpress@yandex.ru'
    html_content = render_to_string('mail_templates/mail_template_btiorder.html', context)
    text_content = strip_tags(html_content)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    if instance.is_emailed == False:
        if subject and html_content and from_email:
            try:
                if msg.send():
                    Order.objects.filter(pk=instance.pk).update(is_emailed=True)
                    instance.is_emailed = True
            except BadHeaderError:
                return print('Invalid header found in email %s' % instance.pk)
            return print('email is sended %s' % instance.pk)
        else:
            return print('Make sure all fields are entered and valid %s' % instance.pk)
    pass
