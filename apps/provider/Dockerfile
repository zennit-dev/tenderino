FROM python:3.11-slim AS base

# Setup environment
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONUNBUFFERED=1 \
    VIRTUAL_ENV=/.venv \
    PATH="/.venv/bin:$PATH"

# Create virtual environment and app user
RUN python -m venv $VIRTUAL_ENV && \
    useradd --create-home appuser && \
    chown -R appuser:appuser /.venv

WORKDIR /home/appuser
USER appuser

COPY --chown=appuser:appuser . .
RUN pip install -r requirements.txt

FROM base AS static-assets

RUN python manage.py collectstatic --no-input

FROM nginx:1.23 AS nginx

COPY /nginx/templates/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=static-assets /home/appuser/static /home/appuser/static

FROM base AS development

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

FROM base AS production

EXPOSE 8000

# Number of gunicorn worker processes (should be between 2-4 workers per core)
ENV WORKERS=4

# Start gunicorn production server
CMD gunicorn --bind :8000 -w $WORKERS provider.wsgi:application
