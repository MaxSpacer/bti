from django.apps import AppConfig

class PdftransConfig(AppConfig):
    name = 'pdftrans'
    # verbose_name = 'Заказы'
    def ready(self):
        import pdftrans.signals 
