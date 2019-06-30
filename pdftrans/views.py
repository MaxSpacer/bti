# from django.conf import settings
# from django.http import HttpResponse
# from django.template.loader import render_to_string
# import weasyprint
# from django.views.generic import DetailView
from django.conf import settings
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML
from django.shortcuts import get_object_or_404
from .models import Order
# from django.conf import settings
from django.views.generic import DetailView
from django_weasyprint import WeasyTemplateResponseMixin# import weasyprint
# @staff_member_required
# def OrderPdfView(request, pk):
#     order = get_object_or_404(Order, id=pk)
#     html = render_to_string('pdf_templates/pdf.html', {'order': order})
#     response = HttpResponse(content_type='application/pdf')
#     response['Content-Disposition'] = 'filename=order_{}.pdf'.format(order.id)
#     weasyprint.HTML(string=html).write_pdf(response,
#                stylesheets=[weasyprint.CSS('static/static_dev/css/styles.css')])
#     return response
class OrderView(DetailView):
    # vanilla Django DetailView
    model = Order
    template_name = 'pdf_templates/pdf.html'


class OrderPrintView(WeasyTemplateResponseMixin, OrderView):
    # output of OrderView rendered as PDF with hardcoded CSS
    pdf_stylesheets = [
        settings.STATIC_ROOT + '/css/styles.css',
    ]
    # show pdf in-line (default: True, show download dialog)
    pdf_attachment = False
    # suggested filename (is required for attachment!)
    pdf_filename = 'foo.pdf'

#
# class OrderImageView(WeasyTemplateResponseMixin, OrderView):
#     # generate a PNG image instead
#     content_type = CONTENT_TYPE_PNG
#
#     # dynamically generate filename
#     def get_pdf_filename(self):
#         return 'bar-{at}.pdf'.format(
#             at=timezone.now().strftime('%Y%m%d-%H%M'),
#         )
