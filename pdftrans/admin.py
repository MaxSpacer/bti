from django.contrib import admin
from .models import Order, Adress, ExplicationListItem, ExplicationSquareTotal

class AdressInline(admin.StackedInline):
    model = Adress# Register your models here.
class ExplicationListItemInline(admin.TabularInline):
    model = ExplicationListItem# Register your models here.
class ExplicationSquareTotalInline(admin.TabularInline):
    model = ExplicationSquareTotal# Register your models here.

class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]
    readonly_fields = ('barcode','qrcode','order_number')
    inlines = [AdressInline,ExplicationListItemInline,ExplicationSquareTotalInline]
admin.site.register(Order, OrderAdmin)
