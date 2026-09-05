from rest_framework import serializers
from accounts.models import User, CandidateProfile, RecruiterProfile, Company

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
        ]

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User.objects.create_user(
            password=password,
            **validated_data
        )

        if user.role == User.Role.CANDIDATE:
            CandidateProfile.objects.create(user=user)

        elif user.role == User.Role.RECRUITER:
            pass

        return user

class CandidateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = [
            "phone",
            "location",
            "bio",
            "education",
            "experience",
            "profile_photo",
            "resume",
            "created_at",
            "updated_at",
        ]


class RecruiterProfileSerializer(serializers.ModelSerializer):
    recruiter_name = serializers.CharField(
        source="user.get_full_name",
        read_only=True
    )

    recruiter_email = serializers.EmailField(
        source="user.email",
        read_only=True
    )

    company_name = serializers.CharField(
        source="company.name",
        read_only=True
    )

    class Meta:
        model = RecruiterProfile
        fields = [
            "recruiter_name",
            "recruiter_email",
            "company",
            "company_name",
            "phone",
            "designation",
            "profile_photo",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "recruiter_name",
            "recruiter_email",
            "company_name",
            "created_at",
            "updated_at",
        ]



class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "description",
            "website",
            "location",
            "industry",
            "logo",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "updated_at",
        ]