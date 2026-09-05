from rest_framework import serializers
from jobs.models import Job, Application


class JobSerializer(serializers.ModelSerializer):

    recruiter = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    company = serializers.PrimaryKeyRelatedField(
        read_only=True
    )

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = Job

        fields = [
            "id",
            "title",
            "description",
            "company",
            "company_name",
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

        read_only_fields = [
            "id",
            "company",
            "recruiter",
            "created_at",
            "updated_at",
        ]


class ApplicationSerializer(serializers.ModelSerializer):

    job_title = serializers.CharField(
        source="job.title",
        read_only=True
    )

    company_name = serializers.CharField(
        source="job.company.name",
        read_only=True
    )

    job_location = serializers.CharField(
        source="job.location",
        read_only=True
    )

    candidate_name = serializers.CharField(
        source="candidate.user.get_full_name",
        read_only=True
    )

    candidate_email = serializers.EmailField(
        source="candidate.user.email",
        read_only=True
    )

    class Meta:
        model = Application

        fields = [
            "id",
            "candidate",
            "candidate_name",
            "candidate_email",
            "job",
            "job_title",
            "company_name",
            "job_location",
            "cover_letter",
            "status",
            "applied_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "candidate",
            "candidate_name",
            "candidate_email",
            "status",
            "applied_at",
            "updated_at",
            "job_title",
            "company_name",
            "job_location",
        ]

    def validate(self, data):

        request = self.context.get("request")

        if request and request.user.is_authenticated:

            candidate = getattr(
                request.user,
                "candidate_profile",
                None
            )

            if candidate:

                job = data["job"]

                # Check whether the job is closed
                if job.status == Job.Status.CLOSED:
                    raise serializers.ValidationError({
                        "job": "This job is closed and no longer accepting applications."
                    })

                # Check whether candidate already applied
                existing_application = Application.objects.filter(
                    candidate=candidate,
                    job=job
                ).first()

                if existing_application:

                    # Candidate was already rejected
                    if existing_application.status == "REJECTED":
                        raise serializers.ValidationError({
                            "job": "You were rejected for this job and cannot apply again."
                        })

                    # Candidate already has an active application
                    raise serializers.ValidationError({
                        "job": "You have already applied for this job."
                    })

        return data


class ApplicationStatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Application

        fields = [
            "status"
        ]