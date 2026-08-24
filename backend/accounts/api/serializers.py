from rest_framework import serializers
from accounts.models import User, CandidateProfile, RecruiterProfile

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