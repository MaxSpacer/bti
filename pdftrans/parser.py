# -*- coding: utf-8 -*-

import re, os
import camelot
from django.conf import settings
import csv as CSV
from .models import Adress

def get_source_adress_func(arg_up_pdf_url,arg_coorditates_on_pages,arg_search_on_page):
    uploaded_pdf_url = arg_up_pdf_url
    # print('type(table_areas)')
    print('arg_coorditates_on_pages')
    print(arg_coorditates_on_pages)
    print(arg_search_on_page)
    # table_areas = arg_coorditates_on_pages
    # address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,400,665'])
    address_string = camelot.read_pdf(uploaded_pdf_url, pages=arg_search_on_page, flavor='stream', row_tol=9, table_areas=arg_coorditates_on_pages)
    csv_address_f = os.path.join(settings.MEDIA_ROOT, 'temp', 'csv_address.csv')
    csv = address_string[0].to_csv(csv_address_f)
    if csv_address_f:
        with open(csv_address_f, 'r', encoding='utf-8') as f:
            row_read = CSV.reader(f)
            full_adress_string = ''
            for row in row_read:
                print('source row')
                print(row)
                print(type(row))
                for ro in row:
                    ro  = ro.replace('По адресу:','')
                    ro  = ro.replace('№','')
                    full_adress_string += ro + ' '

            print('full_adress_string')
            print(full_adress_string)

            f.close()
    return full_adress_string


def adress_parser_func(arg_adress_string):
    print('*******parsing****start****')
    print('pars-->' + str(arg_adress_string))
    # print(arg_list)
    adress_item_list = arg_adress_string.strip(",").split(",")
    print('adress_item_list')
    print(adress_item_list)
    after_parsing_dict  = {}
    find_list = [
    'город',
    # 'г.',
    'поселок',
    # 'п.',
    'городское поселение',
    'поселение',
    # 'пос.',
    'деревня',
    # 'д.',
    'СНТ',
    'село',
    # 'с.',
    'микрорайон',
    # 'мкр-н',
    # 'мкр',
    'улица',
    # 'ул.',
    'переулок',
    # 'пер.',
    'проспект',
    # 'пр-т.',
    # 'просп.',
    'проезд',
    # 'пр-д.',
    # 'пр.',
    'шоссе',
    # 'ш.',
    'площадь',
    # 'пл.',
    'набережная',
    # 'наб.',
    'бульвар',
    # 'б-р.',
    # 'бул.',
    'дом',
    # 'д.',
    'корпус',
    # 'кор.',
    # 'к.',
    'литера',
    # 'лит.',
    'строение',
    # 'стр.',
    'Квартира',
    ]
    for item in adress_item_list:
        # print('item_in parsing')
        # print(item)
        for str_item in find_list:
            pattern = str(str_item) + "\\b"
            regex = re.compile(pattern)
            # regex = re.compile(rf'{str_item}\b') #for windows os
            s = regex.search(item)
            print('---------str_item----------')
            print(str_item)

            if s:
                print('****key_string****')
                key_string = s.group()
                print('key_string')
                print(key_string)
                # print('****value_string****')
                arg_string = regex.sub('', item)
                print('arg_string')
                print(arg_string)
                arg_string = re.sub(r'\s+', ' ', arg_string).strip()
                print(arg_string)
                # print('arg_string')
                # print(arg_string)
                return_address_list = [key_string,arg_string]
                # print('return_address_list')
                # print(return_address_list)
                after_parsing_dict.update({key_string: arg_string})

        print('after_parsing_dict')
        print(after_parsing_dict)
    after_parsing_dict.update({'row_full_adress_string': arg_adress_string})
    print('*******parsing****end******')
    return after_parsing_dict


def pull_adress_db(arg_instance_order, arg_begin_dict):
    # print('arg_begin_dict')
    # print(arg_begin_dict)
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
    municipal_flag = 0
    for key, value in arg_begin_dict.items():
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
                if total_dict['city_type'] != 'город':
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

        elif key == 'Квартира':
            k = 'global_appartment'
            v = value
            total_dict.update({k: v})

        elif key == 'row_full_adress_string':
            k = 'full_adress'
            v = value
            no_appart_adress_string = ''
            no_appart_adress_list = v.split(',')
            del no_appart_adress_list[-1]
            for l in no_appart_adress_list:
                no_appart_adress_string += l + ', '
            print('no_appart_adress_list')
            print(no_appart_adress_list)
            print('no_appart_adress_string')
            print(no_appart_adress_string)
            total_dict.update({k: no_appart_adress_string})

    print('--------------total_dict-------------------')
    print(total_dict)
    va, created = Adress.objects.update_or_create(
    order=arg_instance_order,
    defaults=total_dict,
    )
    return va
    # pass
