from django.contrib import admin

from .models import DocumentTender, Tender, TenderCriteria

# Register your models here.

admin.site.register(Tender)
admin.site.register(TenderCriteria)
admin.site.register(DocumentTender)
