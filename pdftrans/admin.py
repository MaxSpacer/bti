from django.contrib import admin
from .models import *
from django.utils.html import format_html
from django.conf import settings
from django.urls import reverse_lazy

class HeaderExplicationAdmin(admin.ModelAdmin):
    list_display = [field.name for field in HeaderExplication._meta.fields]
admin.site.register(HeaderExplication, HeaderExplicationAdmin)

class CashItogAdmin(admin.ModelAdmin):
    list_display = ['order_otof',
                    'order_price',
                    'show_firm_url',
                    'created',
                    'updated',]
    # readonly_fields = ['cash_url',]
    def show_firm_url(self, obj):
        return format_html("<a class='button' href='{cash_url}'>{url}</a>", url="Получить чек", cash_url=obj.cash_url)

    show_firm_url.short_description = "Получиь чек"
    # list_display = [field.name for field in CashItog._meta.fields]
admin.site.register(CashItog, CashItogAdmin)

class OrderImageInline(admin.TabularInline):
    model = OrderImage# Register your models here.
    # def full_pdf_url(self, obj):
    #     return format_html("<a href='{url}'>{url}</a>", url=obj.fullpdf_url_staff)
    # readonly_fields = ['full_pdf_url', 'fullpdf_url_staff', 'order_image',]
    # readonly_fields = ['fullpdf_url_staff', 'order_image']
    readonly_fields = [field.name for field in OrderImage._meta.fields]
    # max_num = 1

class AdressInline(admin.StackedInline):
    model = Adress# Register your models here.

class ExplicationListItemInline(admin.TabularInline):
    model = ExplicationListItem# Register your models here.
    readonly_fields = [field.name for field in ExplicationListItem._meta.fields]

class ExplicationSquareTotalInline(admin.TabularInline):
    model = ExplicationSquareTotal# Register your models here.
    readonly_fields = [field.name for field in ExplicationSquareTotal._meta.fields]

class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('barcode','qrcode','order_number','is_emailed')
    inlines = [OrderImageInline, AdressInline, ExplicationSquareTotalInline, ExplicationListItemInline]
    list_display = ['order_number', 'show_adress_on_admin',
                    'customer_data', 'subj_type',
                    'doc_type', 'type_object',
                    'header_object', 'show_url_on_pdf',
                    'is_emailed', 'id',]
    def show_url_on_pdf(self, instance):
        prefix = settings.WEB_PROTOCOL_STRING
        current_site = Site.objects.get_current().domain
        if instance.subj_type !='Москва':
            str_for_traslit = "%s%s%s" % (prefix, current_site, reverse_lazy('pdftrans:order_mo_full_pdf_view_n', kwargs={'pk': instance.pk}))
        else:
            str_for_traslit = "%s%s%s" % (prefix, current_site, reverse_lazy('pdftrans:order_full_pdf_view_n', kwargs={'pk': instance.pk}))
        return format_html("<a href=%s>Ссылка на документ</a>" % str_for_traslit)

    def show_adress_on_admin(self, instance):
        return instance.get_order_adress().get_full_adress()

admin.site.register(Order, OrderAdmin)

class OrderTechAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderTech._meta.fields]
    # readonly_fields = ('barcode','qrcode','order_number')
    # inlines = [OrderTechImageInline, AdressInline, ExplicationSquareTotalInline, ExplicationListItemInline]
admin.site.register(OrderTech, OrderTechAdmin)
