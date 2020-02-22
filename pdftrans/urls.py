"""bti URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import path
from . import views
from django.views.generic import DetailView, TemplateView
from .models import Order

# app_name = 'pdftrans'


urlpatterns = [
    path('prover-document/', TemplateView.as_view(template_name="pdftrans/mo_order_detail.html")),
    path('prover-document/order_checking/', views.order_checking, name='order_checking_n'),
    path('<int:pk>/', DetailView.as_view(model=Order,template_name = 'pdftrans/order_detail.html'), name='order_detail_n'),
    path('pdf/<int:pk>/', views.OrderPrintView.as_view(), name='order_pdf_view_n'),
    path('fullpdf/<int:pk>/', views.document_bti_pdf, name='order_full_pdf_view_n'),
    path('qr/<int:referer_id>/', views.OrderRedirectView, name='order_redirect_view_n'),
]
