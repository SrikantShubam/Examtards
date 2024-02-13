# In your app's admin.py

from django.contrib import admin
from import_export.admin import ImportExportModelAdmin
from .models import Exam, SyllabusFile, PatternFile, Category
from .resources import ExamResource, SyllabusFileResource, PatternFileResource, CategoryResource

@admin.register(Exam)
class ExamAdmin(ImportExportModelAdmin):
    resource_class = ExamResource

@admin.register(SyllabusFile)
class SyllabusFileAdmin(ImportExportModelAdmin):
    resource_class = SyllabusFileResource

@admin.register(PatternFile)
class PatternFileAdmin(ImportExportModelAdmin):
    resource_class = PatternFileResource

@admin.register(Category)
class CategoryAdmin(ImportExportModelAdmin):
    resource_class = CategoryResource
