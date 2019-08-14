# -*- coding: utf-8 -*-

from django.db import models


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
