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
        'корпус',
        # 'кор.',
        # 'к.',
        'литера',
        # 'лит.',
        'строение'
        # 'стр.',
    ]
    for str_item in find_list:
        # return_address_dict = {}
        pattern = str(str_item) + "\\b"
        print('pattern')
        print(pattern)
        regex = re.compile(pattern)
        print('arg_string')
        print(arg_string)
        # regex = re.compile(rf'{str_item}\b')
        print('regex')
        print(regex)
        s = regex.search(arg_string)
        print('s')
        print(s)
        if s:
            print('****key_string****')
            key_string = s.group()
            print(key_string)
            print('****value_string****')
            arg_string = regex.sub('', arg_string)
            arg_string = re.sub(r'\s+', ' ', arg_string).strip()
            print('arg_string')
            print(arg_string)
            return_address_list = [key_string,arg_string]
            print('return_address_list')
            print(return_address_list)
            return return_address_list
        else:
            print('not find anythng')


def adress_parser_func(arg_list):
    print('*******parsing****start****')
    print('pars_arg_list' + str(arg_list))
    # print(arg_list)
    j = 0
    after_parsing_dict  = {}
    for item in arg_list:
        print('parsing*-*')
        print('item_in parsing')
        print(item)
        list_to_dict = clr_str_func(item)
        print('list_to_dict')
        print(list_to_dict)
        after_parsing_dict.update({list_to_dict[0]: list_to_dict[1]})
        j += 1

    # print('after_parsing_dict')
    # print(after_parsing_dict)
    print('*******parsing****end******')
    return after_parsing_dict
