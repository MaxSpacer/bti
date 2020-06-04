from django.contrib import admin
from .models import *
from django.utils.html import format_html


class HeaderExplicationAdmin(admin.ModelAdmin):
    list_display = [field.name for field in HeaderExplication._meta.fields]
admin.site.register(HeaderExplication, HeaderExplicationAdmin)

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
    list_display = [field.name for field in Order._meta.fields]
    # def full_pdf_url(self, obj):
    #     return format_html("<a href='{url}'>{url}</a>", url=obj.fullpdf_url_staff)
    # readonly_fields = ['full_pdf_url', 'fullpdf_url_staff', 'order_image',]
    # readonly_fields = ['fullpdf_url_staff', 'order_image']
    readonly_fields = ('barcode','qrcode','order_number','is_emailed')
    # readonly_fields = ('my_clickable_link',)

    # def full_pdf_url(self, instance):
    #     print('instance---------=------------=---------=')
    #     print(instance.subj_type)
    #     if instance.subj_type == 'Москва':
    #
    #
    #     return format_html(
    #         '<a href="{0}" target="_blank">{0}</a>',
    #         instance.id,
    #         # instance.<link-field>,
    #     )
        # return format_html(
        #     '<a href="{0}" target="_blank">{1}</a>',
        #     instance.<link-field>,
        #     instance.<link-field>,
        # )
    # full_pdf_url.short_description = "Click Me"
    inlines = [OrderImageInline, AdressInline, ExplicationSquareTotalInline, ExplicationListItemInline]
admin.site.register(Order, OrderAdmin)

class OrderTechAdmin(admin.ModelAdmin):
    list_display = [field.name for field in OrderTech._meta.fields]
    # readonly_fields = ('barcode','qrcode','order_number')
    # inlines = [OrderTechImageInline, AdressInline, ExplicationSquareTotalInline, ExplicationListItemInline]
admin.site.register(OrderTech, OrderTechAdmin)
