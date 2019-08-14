from django.contrib import admin
from .models import *
# Register your models here.

class DocTypeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in DocType._meta.fields]
admin.site.register(DocType, DocTypeAdmin)

class TypeObjectAdmin(admin.ModelAdmin):
    list_display = [field.name for field in TypeObject._meta.fields]
admin.site.register(TypeObject, TypeObjectAdmin)

class NameObjectAdmin(admin.ModelAdmin):
    list_display = [field.name for field in NameObject._meta.fields]
admin.site.register(NameObject, NameObjectAdmin)
