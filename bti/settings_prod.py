# DEBUG = False
ALLOWED_HOSTS = ['167.71.54.163', 'localhost', '127.0.0.1']

#settings for db on server
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'bti_db',
        'USER': 'bti_db_user',
        'PASSWORD': 'GoKxZ3&9',
        'HOST': 'localhost',
        'PORT': '',                      # Set to empty string for default.
    }
}
# EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_HOST = 'localhost'
# EMAIL_PORT = '1025'
# EMAIL_HOST = 'smtp.yandex.ru'
# EMAIL_PORT = 465
# EMAIL_HOST_USER = "info@doxaih.ru"
# EMAIL_HOST_PASSWORD = "In123456"
# EMAIL_USE_SSL = True
# SERVER_EMAIL = EMAIL_HOST_USER
# DEFAULT_FROM_EMAIL = EMAIL_HOST_USER