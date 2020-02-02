from django import template


register = template.Library()

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
