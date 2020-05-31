from weasyprint import CSS
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import Order, ExplicationListItem, Adress
from django.shortcuts import redirect
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin
from django.urls import reverse_lazy
from django.http import HttpResponse, JsonResponse
from django.utils.text import slugify
from django.template.loader import render_to_string
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration
import os
from unidecode import unidecode
from django.core.exceptions import ObjectDoesNotExist


def get_name_file_output(arg_order):
    try:
        str_for_traslit = unidecode(arg_order.adress.city_name + '_' + arg_order.adress.street + '_d_' + arg_order.adress.house_number +'_k_'+ arg_order.adress.global_appartment)
        str_for_traslit = slugify(str_for_traslit)  + '.pdf'
    except Exception as e:
        str_for_traslit = str(arg_order.order_number) + '.pdf'
    return str_for_traslit


class OrderView(DetailView):
    model = Order
    template_name = 'pdf_templates/pdf.html'

class OrderPrintView(WeasyTemplateResponseMixin, OrderView):
    pdf_stylesheets = [
        settings.STATIC_ROOT + '/css/bootstrap.min.css',
        settings.STATIC_ROOT + '/css/styles1.css',
    ]
    pdf_attachment = False
    # w = get_name_file_output(self.kwargs.get(self.slug_url_kwarg, None))
    pdf_filename = 'doc.pdf'


def response_draft(request, pk):
    order = get_object_or_404(Order, pk=pk)
    print(order.id)
    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = "inline; filename={date}-draft-{address}".format(
        date=order.created.strftime('%Y-%m-%d'),
        address=get_name_file_output(order),
    )
    html_string = render_to_string("pdf_templates/draft.html", {
        'order': order,
    })
    font_config = FontConfiguration()
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    html.write_pdf(response, stylesheets=[
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'bootstrap.min.css')),
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'styles_draft.css'))
    ], font_config=font_config)
    return response


def document_mo_bti_pdf(request, pk):
    order = get_object_or_404(Order, pk=pk)
    print(order.id)
    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = "inline; filename={date}-{address}".format(date=order.created.strftime('%Y-%m-%d'),
                                                                                address=get_name_file_output(order),)
    html_string = render_to_string("pdf_templates/mo_pdf_full.html", {
        'order': order,
    })
    font_config = FontConfiguration()
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    html.write_pdf(response, stylesheets=[
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'bootstrap.min.css')),
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'styles_mo.css'))
    ], font_config=font_config)
    return response


def document_bti_pdf(request, pk):
    order = get_object_or_404(Order, pk=pk)
    print(order.id)
    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = "inline; filename={date}-{address}".format(
        date=order.created.strftime('%Y-%m-%d'),
        address=get_name_file_output(order),
    )
    html_string = render_to_string("pdf_templates/pdf_full.html", {
        'order': order,
    })
    font_config = FontConfiguration()
    html = HTML(string=html_string, base_url=request.build_absolute_uri())
    html.write_pdf(response, stylesheets=[
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'bootstrap.min.css')),
    CSS(os.path.join(settings.STATIC_ROOT, 'css', 'styles3.css'))
    ], font_config=font_config)
    return response


def OrderRedirectView(request, referer_id):
    order_instance = get_object_or_404(Order,order_number=referer_id)
    return redirect(reverse_lazy('pdftrans:order_detail_n', kwargs={'pk': order_instance.pk}))


def order_checking(request):
    print('all good')
    response = dict()
    data = request.POST
    code = data['code']
    print(data['code'])
    print(request.POST)
    if len(code) == 0:
        response['ERROR_MESSAGE_CODE'] = 'EMPTY_FIELDS'
    else:
        if len(code) != 12:
            response['ERROR_MESSAGE_CODE'] = 'INVALID_CODE_LENGTH'
        else:
            code = code.lstrip('0')
            try:
                order_checked = Order.objects.get(order_number = code)
                if order_checked:
                    adress_from_order_checked = Adress.objects.get(order=order_checked)
                    response['STATUS'] = 'ok'
                    response['ObjectAdress'] = adress_from_order_checked.get_full_adress()
            except ObjectDoesNotExist:
                print("Either the order_checked doesn't exist.")
                response['ERROR_MESSAGE_CODE'] = 'DOCUMENT_DOESNT_EXIST'
    return JsonResponse(response)
