# -*- coding: utf-8 -*-

import re, os
import camelot
from django.conf import settings
import csv as CSV


def get_source_adress_func(arg_up_pdf_url):
    uploaded_pdf_url = arg_up_pdf_url
    address_string = camelot.read_pdf(uploaded_pdf_url, flavor='stream', row_tol=9, table_areas=['50,720,400,660'])
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
    print('*******parsing****end******')
    return after_parsing_dict
