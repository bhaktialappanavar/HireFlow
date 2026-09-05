from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "company",
        "recruiter",
        "status",
        "deadline",
    )

    list_filter = (
        "status",
        "job_type",
    )

    search_fields = (
        "title",
        "location",
        "skills",
    )