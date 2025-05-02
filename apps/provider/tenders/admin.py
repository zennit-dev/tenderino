from django.contrib import admin

from .models import DocumentTenderCriteria, Tender, TenderCriteria

# Register your models here.

admin.site.register(Tender)
admin.site.register(TenderCriteria)
admin.site.register(DocumentTenderCriteria)
