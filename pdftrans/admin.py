from django.contrib import admin
from .models import *
# Register your models here.
class OrderAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Order._meta.fields]
    # inlines = [OrderImageInline]
admin.site.register(Order, OrderAdmin)
