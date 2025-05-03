from django.contrib import admin

from .models import Application, CriteriaCompleted, DocumentCriteriaCompleted

# Register your models here.
admin.site.register(Application)
admin.site.register(CriteriaCompleted)
admin.site.register(DocumentCriteriaCompleted)
