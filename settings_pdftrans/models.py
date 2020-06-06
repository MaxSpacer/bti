# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.sites.models import Site
from tinymce.models import HTMLField


class PriceItem(models.Model):
    name_price_item = models.CharField(max_length=128, blank=True, null=True)
    cost_price_item = models.PositiveSmallIntegerField(blank=True, null=True, default = 0, verbose_name="стоимость услуги, в руб.")
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True)

    def __str__(self):
        return self.name_price_item

    class Meta:
        verbose_name = 'Услуга'
        verbose_name_plural = 'Услуги'


class HeaderExplication(models.Model):
    name_template = models.CharField(verbose_name="Имя шаблона шапки", max_length=128, blank=True, null=False)
    text_header = HTMLField('текст шапки')
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        # app_label = 'settings_pdftrans'
        verbose_name = 'шаблон шапки'
        verbose_name_plural = 'шаблоны шапки'

    def __str__(self):
        return "%s" % self.name_template


class SubjectType(models.Model):
    subject_type = models.CharField(verbose_name="субъект РФ", max_length=64, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'субъект РФ'
        verbose_name_plural = 'субъекты РФ'

    def __str__(self):
        return "%s" % self.subject_type


class DocType(models.Model):
    docs_type = models.CharField(verbose_name="тип документа", max_length=64, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'тип документа'
        verbose_name_plural = 'типы документа'

    def __str__(self):
        return "%s" % self.docs_type


class TypeObject(models.Model):
    objects_type = models.CharField(verbose_name="вид объекта учета", max_length=64, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'вид объекта учета'
        verbose_name_plural = 'виды объекта учета'

    def __str__(self):
        return "%s" % self.objects_type


class NameObject(models.Model):
    objects_name = models.CharField(verbose_name="наименование объекта учета", max_length=64, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        verbose_name = 'наименование объекта учета'
        verbose_name_plural = 'наименования объекта учета'

    def __str__(self):
        return "%s" % self.objects_name


class ProtocolType(models.Model):
    site = models.OneToOneField(Site, on_delete=models.CASCADE)
    protocol_type = models.CharField(max_length=32, default="")
    created = models.DateTimeField(auto_now_add=True , auto_now=False)
    updated = models.DateTimeField(auto_now_add=False , auto_now=True)

    class Meta:
        app_label = 'sites'
        verbose_name = 'Тип протокола'
        verbose_name_plural = 'Типы протокола'

    def __str__(self):
        return "%s" % self.protocol_type

    def __init__(self,  *args, **kwargs):
        def get_name_object_choices():
            NAME_OBJECT_CHOICES = [
            ('http://','http://'),
            ('https://','https://'),
            ]
            return NAME_OBJECT_CHOICES
        self._meta.get_field('protocol_type').choices = get_name_object_choices()
        self._meta.get_field('protocol_type').default = get_name_object_choices()[0]
        super(ProtocolType, self).__init__(*args, **kwargs)
