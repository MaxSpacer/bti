from weasyprint import CSS
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import Order, ExplicationListItem
from django.shortcuts import redirect
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin
from django.urls import reverse_lazy
from django.http import HttpResponse
from django.utils.text import slugify
from django.template.loader import render_to_string
from weasyprint import HTML
from weasyprint.fonts import FontConfiguration
import os
from unidecode import unidecode


class OrderView(DetailView):
    model = Order
    template_name = 'pdf_templates/pdf.html'

class OrderPrintView(WeasyTemplateResponseMixin, OrderView):
    pdf_stylesheets = [
        settings.STATIC_ROOT + '/css/bootstrap.min.css',
        settings.STATIC_ROOT + '/css/styles1.css',
    ]
    pdf_attachment = False
    pdf_filename = 'doc.pdf'


class OrderFullView(DetailView):
    model = Order
    template_name = 'pdf_templates/pdf_full.html'

# class OrderPrintFullView(WeasyTemplateResponseMixin, OrderFullView):
#     pdf_stylesheets = [
#         settings.STATIC_ROOT + '/css/bootstrap.min.css',
#         settings.STATIC_ROOT + '/css/styles3.css',
#     ]
#     pdf_attachment = False
#     pdf_filename = 'documents.pdf'



def document_bti_pdf(request, pk):
    order = get_object_or_404(Order, pk=pk)
    print('order')
    print(order)
    print(order.id)
    # print(order.adress)
    # print(order.adress.street)
    explication_list_items = ExplicationListItem.objects.filter(order_list=order.id).first()
    try:
        str_for_traslit = unidecode(order.adress.city_name + '_' + order.adress.street + '_d_' + order.adress.house_number +'_k_'+ explication_list_items.apart_number)
        str_for_traslit = slugify(str_for_traslit)  + '.pdf'
        # str_for_traslit = str_for_traslit
    except Exception as e:
        str_for_traslit = str(order.order_number) + '.pdf'
    # filename = os.path.join(settings.MEDIA_ROOT, 'temp', str_for_traslit)
    response = HttpResponse(content_type="application/pdf")
    response['Content-Disposition'] = "inline; filename={date}-{address}".format(
        date=order.created.strftime('%Y-%m-%d'),
        # name=slugify(order.order_number),
        # print('order')
        # print(order.id)
        # print(order.adress)
        address=str_for_traslit,
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
