from django.contrib import admin
from .models import Pin, PinContent, Category

admin.site.register(Pin)
admin.site.register(PinContent)
admin.site.register(Category)
