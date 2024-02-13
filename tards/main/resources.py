# In your app's resources.py

from import_export import resources
from .models import Exam, SyllabusFile, PatternFile, Category

class ExamResource(resources.ModelResource):
    class Meta:
        model = Exam

class SyllabusFileResource(resources.ModelResource):
    class Meta:
        model = SyllabusFile

class PatternFileResource(resources.ModelResource):
    class Meta:
        model = PatternFile

class CategoryResource(resources.ModelResource):
    class Meta:
        model = Category
