from rest_framework import serializers
from jobs.models import Job, Application

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

class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application
        fields = [
            "id",
            "candidate",
            "job",
            "cover_letter",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "candidate",
            "status",
            "applied_at",
            "updated_at",
        ]
    
    def validate(self,data):
        request = self.context.get("request")

        if request and request.user.is_authenticated:
            candidate = getattr(
                request.user,
                "candidate_profile",
                None
            )

            if candidate and Application.objects.filter(
                candidate=candidate,
                job=data["job"]
            ).exists():
                raise serializers.ValidationError({
                    "job":"You have already applied for this job."
                })

        return data