from django.urls import path
from .views import (JobCreateView, JobListView, JobDetailView, ApplicationCreateView,MyApplicationView,
)

urlpatterns = [
    path("",JobListView.as_view(), name="job-list"),
    path("create/", JobCreateView.as_view(), name="job-create"),
    path("<int:pk>/", JobDetailView.as_view(), name="job-detail"),
    path("applications/",ApplicationCreateView.as_view(),name="application-create"),
    path("applications/my/",MyApplicationView.as_view(),name="my-application",),

]