from django.apps import AppConfig


class PdftransConfig(AppConfig):
    name = 'pdftrans'
    def ready(self):
        import pdftrans.signals
