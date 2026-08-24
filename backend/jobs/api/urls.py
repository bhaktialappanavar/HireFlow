from django.urls import path
from .views import JobCreateView, JobListView

urlpatterns = [
    path("",JobListView.as_view(), name="job-list"),
    path("create/", JobCreateView.as_view(), name="job-create"),
]