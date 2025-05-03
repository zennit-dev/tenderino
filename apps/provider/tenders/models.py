from django.db import models


class Status(models.TextChoices):
    DRAFT = "Draft", "Draft"
    PUBLISHED = "Published", "Published"
    OPEN = "Open", "Open"
    UNDER_EVALUATION = "Under Evaluation", "Under Evaluation"
    CLOSED = "Closed", "Closed"
    AWARDED = "Awarded", "Awarded"


class TenderCategory(models.TextChoices):
    EVALUATION = "Evaluation", "Evaluation"
    APPLICATION = "Application", "Application"
    QUALIFICATION = "Qualification", "Qualification"


class TenderType(models.TextChoices):
    DOCUMENT = "document", "document"
    DESCRIPTION = "description", "description"


class Tender(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    open_date = models.DateTimeField()
    expire_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status, default="Draft")
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self) -> str:
        return self.title


class TenderCriteria(models.Model):
    category = models.CharField(
        max_length=20, choices=TenderCategory, default="Evaluation"
    )
    type = models.CharField(max_length=20, choices=TenderType, default="description")
    description = models.TextField()
    tender = models.ForeignKey(
        "tenders.Tender", related_name="criteria", on_delete=models.CASCADE
    )
    weight = models.FloatField(default=0.0)

    def __str__(self) -> str:
        return f"{self.tender.title} - {self.category}"


class DocumentTender(models.Model):
    tender = models.ForeignKey(
        Tender, related_name="documents", on_delete=models.CASCADE
    )
    document = models.FileField(upload_to="tender_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for {self.tender}"
