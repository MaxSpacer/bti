from django import template


register = template.Library()

@register.filter('increment1')
def increment1(value):
    value = value + 1
    return value

@register.filter('multipliticy')
def multipliticy(value):
    value = value - 16
    return (True if value % 35 == 0 else False)

@register.filter('intspace')
def intspace(value):
    s = str(value)
    l = str()
    i = 0
    space = " "
    for x in str(value):
        if (i == 2 or i == 4):
            l = l + space
            print(l)
        l = l + s[i]
        i+=1
    return l

@register.filter('absolute_address')
def absolute_address(value):
    s = str(value)
    list = [
        'улица',
        'ул.',
        'переулок',
        'пер.',
        'проспект',
        'пр-т.',
        'просп.',
        'проезд',
        'пр-д.',
        'пр.',
        'шоссе',
        'ш.',
        'площадь',
        'пл.',
        'набережная',
        'наб.',
        'бульвар',
        'б-р.',
        'бул.',
        ]
    for x in list:
        if x in s:
            s = s.replace(x, "")
            s = s.replace('  ', " ")
    return s
