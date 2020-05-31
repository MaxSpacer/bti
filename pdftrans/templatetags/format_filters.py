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


@register.filter('possessive_case')
def possessive_case(value):
    return_possessive_case_string = ''
    if 'вартира' in value:
        return_possessive_case_string = 'квартиры'
    elif 'омещени' in value:
        return_possessive_case_string = 'помещения'
    elif 'партамент' in value:
        return_possessive_case_string = 'апартаментов'
    elif 'дом' in value:
        return_possessive_case_string = 'дома'
    return return_possessive_case_string


@register.filter('objective_case')
def objective_case(value):
    return_objective_case_string = ''
    if 'вартира' in value:
        return_objective_case_string = 'квартире'
    elif 'омещени' in value:
        return_objective_case_string = 'помещению'
    elif 'партамент' in value:
        return_objective_case_string = 'апартаментам'
    elif 'дом' in value:
        return_objective_case_string = 'дому'
    return return_objective_case_string


# exec here templates\pdftrans\order_detail.html string 49
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


@register.filter('threedigit')
def threedigit(value):
    ret_str = ''
    line = '00' + str(value)
    n=3
    l = [line[i:i+n] for i in range(0, len(line), n)]
    for j in l:
        ret_str = ret_str + '-' + j
    return ret_str.strip('-')


@register.filter('advanced')
def advanced(value):
    if "жилая" in value :
        return 'жилая'
    else:
        return value
