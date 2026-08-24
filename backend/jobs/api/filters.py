import django_filters

from jobs.models import Job


class JobFilter(django_filters.FilterSet):

    location = django_filters.CharFilter(
        field_name="location",
        lookup_expr="icontains"
    )

    job_type = django_filters.CharFilter(
        field_name="job_type"
    )

    experience_level = django_filters.CharFilter(
        field_name="experience_level"
    )

    min_salary = django_filters.NumberFilter(
        field_name="salary_min",
        lookup_expr="gte"
    )

    max_salary = django_filters.NumberFilter(
        field_name="salary_max",
        lookup_expr="lte"
    )

    class Meta:
        model = Job

        fields = [
            "location",
            "job_type",
            "experience_level",
            "min_salary",
            "max_salary",
        ]