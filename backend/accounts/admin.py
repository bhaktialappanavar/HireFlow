from django.contrib import admin
from . models import User, Company, CandidateProfile, RecruiterProfile

admin.site.register(User)
admin.site.register(Company)
admin.site.register(CandidateProfile)
admin.site.register(RecruiterProfile)
