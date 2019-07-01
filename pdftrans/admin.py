from django.contrib import admin
from .models import Order, Adress

class AdressInline(admin.TabularInline):
    model = Adress# Register your models here.

class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]
    readonly_fields = ('barcode','qrcode','order_number')
    inlines = [AdressInline]
admin.site.register(Order, OrderAdmin)
