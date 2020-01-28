# -*- coding: utf-8 -*-

import re


def clr_str_func(arg_string):
    arg_string = str(arg_string)
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
        'корпус.',
        # 'кор.',
        # 'к.',
        'литера.',
        # 'лит.',
        'строение',
        # 'стр.',
    ]
    for str_item in find_list:
        # return_address_dict = {}
        regex = re.compile(rf"{str_item}\b")
        s = regex.search(arg_string)
        if s:
            print('****key_string****')
            key_string = s.group()
            print(key_string)
            print('****value_string****')
            arg_string = regex.sub('', arg_string)
            arg_string = re.sub(r'\s+', ' ', arg_string).strip()
            print(arg_string)
            return_address_list = [key_string,arg_string]
            print(return_address_list)
            return return_address_list
        else:
            pass


def adress_parser_func(arg_list):
    print('*******parsing****start****')
    print('pars_arg_list' + str(arg_list))
    # print(arg_list)
    j = 0
    after_parsing_dict  = {}
    for item in arg_list:
        list_to_dict = clr_str_func(item)
        after_parsing_dict.update({list_to_dict[0]: list_to_dict[1]})
        j += 1

    # print('after_parsing_dict')
    # print(after_parsing_dict)
    print('*******parsing****end******')
    return after_parsing_dict
