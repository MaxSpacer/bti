# -*- coding: utf-8 -*-

from django.db import models
from django.contrib.sites.models import Site


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
