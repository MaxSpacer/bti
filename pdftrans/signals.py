# -*- coding: utf-8 -*-

import os
import json as JSON
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
from .parser import adress_parser_func, get_source_adress_func, pull_adress_db

@receiver(post_save, sender=Order)
def export_data_pdf(sender, instance, created, **kwargs):
    uploaded_pdf_url = instance.uploaded_pdf.path
    explication_adress_areas=['50,720,400,665']
    tech_pasports_adress_areas=['30,675,600,615']
    # tech_pasports_adress_areas=['10,820,450,600']
    if instance.doc_type == 'Экспликация на помещение':
    #     if instance.old_source:
    #         explication_adress_areas=['50,680,780,100']
        # table_areas  =
        # if instance.new_source:
            # tables = camelot.read_pdf(uploaded_pdf_url)
        # else:
            # tables = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,680,780,100'])
        # table_areas  =

        full_adress_string = get_source_adress_func(uploaded_pdf_url, explication_adress_areas, '1')
        begin_dict = adress_parser_func(full_adress_string)
        print('***********begin_dict********')
        print(begin_dict)
        adress_db = pull_adress_db(instance, begin_dict)

        tables = camelot.read_pdf(uploaded_pdf_url)
        print('tables sys info')
        print(tables[0])
        print(tables[0].parsing_report)
        print(tables[0].df)

        json_table = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table.json')
        json_table2 = os.path.join(settings.MEDIA_ROOT, 'temp', 'json_table2.csv')
        json = tables[0].to_json(path=json_table)
        # json1 = tables[0].to_csv(path=json_table2)
        # json1 = tables[0].to_csv(path=json_table2, orient = 'records', lines = 'True')
        floor_list = []
        if json_table:
            with open(json_table, 'r') as f:
                print("------------data-------------------")
                data = JSON.load(f)
                ExplicationListItem.objects.filter(order_list=instance).delete()
                i = 0
                data.pop()
                for x in data:
                    print('---------------x---------------')
                    print(x)
                    if i > 2 and x['9'] != '':
                        if x['0'] != '':
                            if x['0'].isdigit():
                                floor_str = 'ЭТАЖ ' + x['0']
                                floor_list.append(floor_str)
                            else:
                                floor_list.append(x['0'])
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
                        apart_number = adress_db.global_appartment
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
                        print('square_total_sum')
                        print(square_total_sum)
                    if items.square_general_item:
                        square_general_sum += string_to_correct_decimal(items.square_general_item)
                        print('square_general_sum')
                        print(square_general_sum)
                    if items.square_advanced_item:
                        square_advanced_sum += string_to_correct_decimal(items.square_advanced_item)
                        print('square_advanced_sum')
                        print(square_advanced_sum)
                    if items.square_logdi_item:
                        square_logdi_sum += string_to_correct_decimal(items.square_logdi_item)
                        print('square_logdi_sum')
                        print(square_logdi_sum)
                    if items.square_balkon_item:
                        square_balkon_sum += string_to_correct_decimal(items.square_balkon_item)
                        print('square_balkon_su')
                        print(square_balkon_sum)
                    if items.square_another_item:
                        square_another_sum += string_to_correct_decimal(items.square_another_item)
                        print('square_another_sum')
                        print(square_another_sum)
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
        print('floor_list')
        print(floor_list)
        current_site = Site.objects.get_current().domain
        path_full_pdf = "https://%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
        # path_full_pdf = "http://%s%s" % (current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
        doc = fitz.open(uploaded_pdf_url)
        # for floor_item in floor_list:
        for page in doc:
            if page.number > 0:
                print('page.number')
                print(page.number)
                path_img_name = str(page.number) + '_schema_' + str(instance.order_number) + '.png'
                path_img_scheme = os.path.join(settings.MEDIA_ROOT, 'schemes/', path_img_name)
                path_img_scheme_bd = "schemes/%s" % path_img_name

                # path_img_name = str(page.number) + '_' + path_img_name
                # path_img_scheme_bd
                # print('ath_img_name--------------------**************')                    # iterate through the pages
                # print(ath_img_name)                    # iterate through the pages
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
                # order_img_clear = OrderImage.objects.filter(order_fk=instance).delete()

                floor_item = floor_list.pop(0)
                print('floor_list------------2')
                print(floor_list)
                create_img = OrderImage(
                order_fk=instance,
                order_image = path_img_scheme_bd,
                fullpdf_url_staff = path_full_pdf,
                floor_for_image = floor_item
                )
                create_img.save()
        doc.close()
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

        search_term = "ЭКСПЛИКАЦИЯ К ПОЭТАЖНОМУ"
        search_term2 = "Экспликация на"
        pdf_document = fitz.open(tech_pasp_input_file)
        pages_list = []
        qr_code_page = 0
        qr_code_page_for_adress_parsing = ''
        for current_page in range(len(pdf_document)):
            page = pdf_document.loadPage(current_page)
            if page.searchFor(search_term):
                print("------- %s found on page %i" % (search_term, current_page))
                qr_code_page = current_page
                qr_code_page_for_adress_parsing = str(current_page + 1)
            if page.searchFor(search_term2):
                pages_list.append(current_page)

        full_adress_string = get_source_adress_func(tech_pasp_input_file, tech_pasports_adress_areas, qr_code_page_for_adress_parsing)
        begin_dict = adress_parser_func(full_adress_string)
        adress_db = pull_adress_db(instance, begin_dict)
        file_handle = fitz.open(tech_pasp_input_file)
        first_page = file_handle[qr_code_page]
        first_page.insertImage(image_rectangle, filename = tech_pasp_qrcode_file)
        # print('ssssssssssssssssssss')
        # print(first_page)
        # print('sssss---pages_list-----sssssss')
        # print(pages_list)
        for x in pages_list:
            tech_pasp_barcode_page = file_handle[x]
            tech_pasp_barcode_page.insertImage(tech_pasp_barcode_image_rectangle, filename = tech_pasp_barcode_file)
            # print('sssssss---x---ssssssssss')
            # print(x)
        file_handle.save(tech_pasp_path_file)
        pdf_document.close()
        # file_handle.save(os.path.join(settings.MEDIA_ROOT, 'tech_pasports/', tech_pasp_path_name))
        # file_handle.save(os.path.join(settings.MEDIA_ROOT, 'tech_pasports/', tech_pasp_path_name))

        v, created = OrderTech.objects.update_or_create(
        order_tech_fk=instance,
        defaults={'order_tech_pasp_pdf': tech_pasp_path_bd}
        )


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
    # pass
