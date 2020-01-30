# -*- coding: utf-8 -*-

import os
import json as JSON
import csv as CSV
import PyPDF2
import re
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
from .adress_parser import adress_parser_func

@receiver(post_save, sender=Order)
def export_data_pdf(sender, instance, created, **kwargs):
    uploaded_pdf_url = instance.uploaded_pdf.path
    if instance.doc_type == 'Экспликация на помещение':
        # address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,780,680'])
        address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,400,680'])
        csv_address_f = os.path.join(settings.MEDIA_ROOT, 'temp', 'csv_address.csv')
        csv = address_string[0].to_csv(csv_address_f)
        if csv_address_f:
            with open(csv_address_f, 'r', encoding='utf-8') as f:
                row_read = CSV.reader(f)
                full_adress_string = ''
                for row in row_read:
                    print('row')
                    print(row)
                    pp = (row[0].strip(" '")).split(":")
                    print('pp')
                    print(pp)
                    if 'Квартира' in pp[0]:
                        hh = [int(s) for s in pp[0].split() if s.isdigit()]
                        global_appartment = hh[0]
                        print('global_appartment')
                        print(global_appartment)
                    else:
                        print('pp2')
                        print(pp)
                        print(pp[1])
                        full_adress_string = pp[1].strip(" ")
                        adress_item_list = pp[1].strip(",").split(",")
                        print('adress_item_list')
                        print(adress_item_list)
                begin_dict = adress_parser_func(adress_item_list)
                print('begin_dict')
                print(begin_dict)
                total_dict = {
                            'mun_type': '',
                            'mun_name': '',
                            'city_type':'город',
                            'city_name': 'Москва',
                            'street_type':'',
                            'street':'',
                            'house_number':'',
                            'corpus_number':'',
                            'litera':'',
                            'build_number':'',
                            'full_adress':'',
                            'global_appartment':''
                            }
                total_dict.update({'full_adress': full_adress_string})
                total_dict.update({'global_appartment': global_appartment})
                municipal_flag = 0
                for key, value in begin_dict.items():
                    # print('item_dict_in_signal')
                    # print(key)
                    # print(value)
                    if key in (
                        'город',
                        'поселок',
                        'городское поселение',
                        'поселение',
                        'деревня',
                        'СНТ',
                        'село',
                    ):
                        if municipal_flag == 0:
                            k = 'city_type'
                            v = key
                            total_dict.update({k: v})
                            k = 'city_name'
                            v = value
                            total_dict.update({k: v})
                            municipal_flag = 1
                        else:
                            total_dict.update({'mun_type': total_dict['city_type']})
                            total_dict.update({'mun_name': total_dict['city_name']})
                            k = 'city_type'
                            v = key
                            total_dict.update({k: v})
                            k = 'city_name'
                            v = value
                            total_dict.update({k: v})

                    elif key in (
                        'микрорайон',
                        'улица',
                        'переулок',
                        'проспект',
                        'проезд',
                        'шоссе',
                        'площадь',
                        'набережная',
                        'бульвар',
                        'улица',
                        ):
                        k = 'street_type'
                        v = key
                        total_dict.update({k: v})
                        k = 'street'
                        v = value
                        total_dict.update({k: v})

                    elif key == 'дом':
                        k = 'house_number'
                        v = value
                        total_dict.update({k: v})

                    elif key == 'корпус':
                        k = 'corpus_number'
                        v = value
                        total_dict.update({k: v})

                    elif key == 'литера':
                        k = 'litera'
                        v = value
                        total_dict.update({k: v})

                    elif key == 'строение':
                        k = 'build_number'
                        v = value
                        total_dict.update({k: v})

                print('total_dict')
                print(total_dict)
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
        path_img_scheme = os.path.join(settings.MEDIA_ROOT, 'schemes/', path_img_name)
        path_img_scheme_bd = "schemes/%s" % path_img_name
        current_site = Site.objects.get_current().domain
        path_full_pdf = "https://%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
        # path_full_pdf = "http://%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
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

        # doc.close()
        # if os.path.exists(uploaded_pdf_url):
        #      os.remove(uploaded_pdf_url)
        # else:
        #       print("The file does not exist")

    elif instance.doc_type == 'Технический паспорт':
        tech_pasp_input_file = instance.uploaded_pdf.path
        tech_pasp_path_name = 'tech_' + str(instance.order_number) + '.pdf'
        tech_pasp_path_file = os.path.join(settings.MEDIA_ROOT, 'tech_pasports/', tech_pasp_path_name)
        tech_pasp_path_bd = "tech_pasports/%s" % tech_pasp_path_name
        tech_pasp_qrcode_file = instance.qrcode.path
        tech_pasp_barcode_file = instance.barcode.path

        image_rectangle = fitz.Rect(470,45,530,105)
        tech_pasp_barcode_image_rectangle = fitz.Rect(15,790,600,820)

        search_term = "ЭКСПЛИКАЦИЯ"
        search_term2 = "ПОЭТАЖНОМУ"
        pdf_document = fitz.open(tech_pasp_input_file)
        pages_list = []
        for current_page in range(len(pdf_document)):
            page = pdf_document.loadPage(current_page)
            if page.searchFor(search_term) and page.searchFor(search_term2):
                print("%s found on page %i" % (search_term, current_page))
                pages_list.append(current_page)

        file_handle = fitz.open(tech_pasp_input_file)
        for x in pages_list:
            first_page = file_handle[x]
            first_page.insertImage(image_rectangle, filename = tech_pasp_qrcode_file)
            first_page.insertImage(tech_pasp_barcode_image_rectangle, filename = tech_pasp_barcode_file)
        pdf_document.close()

        file_handle.save(tech_pasp_path_file)
        # file_handle.save(os.path.join(settings.MEDIA_ROOT, 'tech_pasports/', tech_pasp_path_name))
        # file_handle.save(os.path.join(settings.MEDIA_ROOT, 'tech_pasports/', tech_pasp_path_name))

        # v, created = OrderTech.objects.update_or_create(
        # order_tech_fk=instance
        # defaults={'order_tech_pasp_pdf': tech_pasp_path_bd}
        # )


    # sending email method -=send_mail=-
    # path_full_pdf_for_email = str(path_full_pdf)
    # path_full_link_site = 'https://' + str(current_site) + '/get-order-info/' + str(instance.pk)
    # context = {
    # 'order_number': instance.order_number,
    # 'link_doc': path_full_pdf,
    # 'link_site': path_full_link_site,
    # }
    # str_for_traslit = unidecode(str(instance.adress))
    # subject = str_for_traslit + ' - Док №: ' + str(instance.order_number)
    # from_email = 'btireestrexpress@yandex.ru'
    # to = 'btireestrexpress@yandex.ru'
    # html_content = render_to_string('mail_templates/mail_template_btiorder.html', context)
    # text_content = strip_tags(html_content)
    # msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    # msg.attach_alternative(html_content, "text/html")
    # if instance.is_emailed == False:
    #     if subject and html_content and from_email:
    #         try:
    #             if msg.send():
    #                 Order.objects.filter(pk=instance.pk).update(is_emailed=True)
    #                 instance.is_emailed = True
    #         except BadHeaderError:
    #             return print('Invalid header found in email %s' % instance.pk)
    #         return print('email is sended %s' % instance.pk)
    #     else:
    #         return print('Make sure all fields are entered and valid %s' % instance.pk)
    pass
