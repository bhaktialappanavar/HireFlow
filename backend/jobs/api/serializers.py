from rest_framework import serializers
from jobs.models import Job

class JobSerializer(serializers.ModelSerializer):

    recruiter = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    class Meta:
        model = Job
        fields = [
            "id",
            "title",
            "description",
            "company",
            "recruiter",
            "location",
            "job_type",
            "experience_level",
            "salary_min",
            "salary_max",
            "skills",
            "openings",
            "deadline",
            "status",
            "created_at",
            "updated_at",
        ]

        read_only_field = [
            "id",
            "created_at",
            "updated_at",
        ]