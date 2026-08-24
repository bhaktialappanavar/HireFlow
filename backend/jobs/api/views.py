from rest_framework import generics, filters
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from accounts.api.permissions import IsRecruiter
from jobs.models import Job

from .serializers import JobSerializer
from .filters import JobFilter

class JobCreateView(generics.CreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    permission_classes = [
        IsAuthenticated,
        IsRecruiter,
    ]

    def perform_create(self, serializer):
        recruiter_profile = self.request.user.recruiter_profile

        serializer.save(
            recruiter = recruiter_profile
        )

class JobListView(generics.ListAPIView):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

    permission_classes =[
        IsAuthenticated,
        ]

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = JobFilter

    search_fields = [
        "title",
        "description",
        "location",
        "skills",
    ]

    ordering_fields = [
        "created_at",
        "salary_min",
        "salary_max",
    ]

    ordering = [
        "-created_at"
    ]