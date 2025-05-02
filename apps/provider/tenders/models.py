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


class Tender(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    open_date = models.DateTimeField()
    expire_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status, default="Draft")
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.title


class TenderCriteria(models.Model):
    category = models.CharField(
        max_length=20, choices=TenderCategory, default="Evaluation"
    )
    content = models.TextField()
    tender = models.ForeignKey(
        "tenders.Tender", related_name="criteria", on_delete=models.CASCADE
    )

    def __str__(self) -> str:
        return f"{self.tender.title} - {self.category}"


class DocumentTenderCriteria(models.Model):
    tender_criteria = models.ForeignKey(
        TenderCriteria, related_name="documents", on_delete=models.CASCADE
    )
    document = models.FileField(upload_to="criteria_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Document for {self.tender_criteria}"
