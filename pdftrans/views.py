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
import weasyprint
# @staff_member_required
def OrderPdfView(request, pk):
    order = get_object_or_404(Order, id=pk)
    html = render_to_string('pdf_templates/pdf.html', {'order': order})
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'filename=order_{}.pdf'.format(order.id)
    weasyprint.HTML(string=html).write_pdf(response,
               stylesheets=[weasyprint.CSS('static/static_dev/css/styles.css')])
    return response
