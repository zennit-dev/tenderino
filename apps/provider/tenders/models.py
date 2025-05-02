from django.db import models

class Status(models.TextChoices):
    DRAFT = "Draft", "Draft"
    PUBLISHED = "Published", "Published"
    OPEN = "Open", "Open"
    UNDER_EVALUATION = "Under Evaluation", "Under Evaluation"
    CLOSED = "Closed", "Closed"
    AWARDED = "Awarded", "Awarded"

class TradesInstruments(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    open_date = models.DateTimeField()
    expire_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=Status, default='Draft')
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    category = models.CharField(max_length=100)

    def __str__(self) -> str:
        return self.title