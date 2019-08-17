from django.contrib import admin
from .models import *
from django.utils.html import format_html


class OrderImageInline(admin.TabularInline):
    model = OrderImage# Register your models here.
    # def full_pdf_url(self, obj):
    #     return format_html("<a href='{url}'>{url}</a>", url=obj.fullpdf_url_staff)
    # readonly_fields = ['full_pdf_url', 'fullpdf_url_staff', 'order_image',]
    # readonly_fields = ['full_pdf_url', 'fullpdf_url_staff', 'order_image',]
    max_num = 1

class AdressInline(admin.StackedInline):
    model = Adress# Register your models here.

class ExplicationListItemInline(admin.TabularInline):
    model = ExplicationListItem# Register your models here.
    readonly_fields = [field.name for field in ExplicationListItem._meta.fields]

class ExplicationSquareTotalInline(admin.TabularInline):
    model = ExplicationSquareTotal# Register your models here.
    readonly_fields = [field.name for field in ExplicationSquareTotal._meta.fields]

class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]
    readonly_fields = ('barcode','qrcode','order_number')
    inlines = [OrderImageInline, AdressInline, ExplicationSquareTotalInline, ExplicationListItemInline]
admin.site.register(Order, OrderAdmin)
