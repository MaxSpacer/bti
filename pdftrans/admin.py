from django.contrib import admin
from .models import *

class OrderImageInline(admin.TabularInline):
    model = OrderImage# Register your models here.
    readonly_fields = [field.name for field in OrderImage._meta.fields]
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
    inlines = [AdressInline, OrderImageInline, ExplicationSquareTotalInline, ExplicationListItemInline]
admin.site.register(Order, OrderAdmin)
