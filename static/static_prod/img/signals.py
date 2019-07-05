# -*- coding: utf-8 -*-

from django.core.mail import send_mail, BadHeaderError
from django.http import HttpResponse, HttpResponseRedirect
from django.dispatch import receiver
from django.db.models.signals import post_save
from .models import Callmecontact
# from .models import Mainformcontact
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.shortcuts import get_object_or_404



@receiver(post_save, sender=Callmecontact)
def send_mail_on_callback(sender, instance, created, **kwargs):
    if created:
        context = {
		    'contact_name': instance.customer_name,
		    'callme_number': instance.id,
		    'contact_phone': instance.customer_phone,
		}
        subject = 'Заказ звонка № call-%s' % instance.id
        html_message = render_to_string('mail_templates/mail_callme_template.html', context)
        plain_message = strip_tags(html_message)
        from_email = 'info@doxaih.ru'
        to = 'info@doxaih.ru'
        # print(instance.is_emailed)
        if instance.is_emailed == False:
            if subject and html_message and from_email:
                try:
                    if send_mail(subject, plain_message, from_email, [to], html_message=html_message):
                        Callmecontact.objects.filter(pk=instance.pk).update(is_emailed=True)
                        instance.is_emailed = True
                        # print(instance.is_emailed)

                except BadHeaderError:
                    print('Invalid header found in email %s' % instance.id)
                # return HttpResponse('Invalid header found %s' % instance.id)
                # education_order.is_emailed = True
                return HttpResponse('sended')
            else:
    	        return print('Make sure all fields are entered and valid %s' % instance.id)
