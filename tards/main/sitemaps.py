# your_app/sitemaps.py
from django.contrib.sitemaps import Sitemap
from .models import Exam,SyllabusFile,PatternFile

class ExamSitemap(Sitemap):
    changefreq = 'daily'
    priority = 0.5

    def items(self):
        return Exam.objects.all()

class SyllabusSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7

    def items(self):
        return SyllabusFile.objects.all()
    
class PatternSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 0.7

    def items(self):
        return PatternFile.objects.all()    
