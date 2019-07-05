from weasyprint import CSS
from django.conf import settings
from django.shortcuts import get_object_or_404
from .models import Order
from django.shortcuts import redirect
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin
from django.urls import reverse_lazy


class OrderView(DetailView):
    model = Order
    template_name = 'pdf_templates/pdf.html'


class OrderPrintView(WeasyTemplateResponseMixin, OrderView):
    pdf_stylesheets = [
        settings.STATIC_ROOT + '/css/bootstrap.min.css',
        # settings.STATIC_ROOT + '/css/font_style.css',
        settings.STATIC_ROOT + '/css/styles.css',


    ]
    pdf_attachment = False
    pdf_filename = 'foo.pdf'

def OrderRedirectView(request, referer_id):
    order_instance = get_object_or_404(Order,order_number=referer_id)
    return redirect(reverse_lazy('pdftrans:order_detail_n', kwargs={'pk': order_instance.pk}))
