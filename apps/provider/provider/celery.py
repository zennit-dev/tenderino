import os

from celery import Celery

# Set the default Django settings module
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "provider.settings")

# Create the Celery app instance
app = Celery("provider")

# Load config from Django settings
app.config_from_object("django.conf:settings", namespace="CELERY")

# Configure Celery
app.conf.update(
    broker_url="redis://redis:6379/1",
    result_backend="redis://redis:6379/1",
    broker_connection_retry_on_startup=True,
    broker_connection_max_retries=10,
    broker_transport="redis",
    enable_utc=True,
)

# Auto-discover tasks
app.autodiscover_tasks()
