from django.contrib import admin
from .models import Exam
from .models import Exam,SyllabusFile,PatternFile,Category

admin.site.register(Exam)
admin.site.register(SyllabusFile)
admin.site.register(PatternFile)
admin.site.register(Category)
