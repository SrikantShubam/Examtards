from django.urls import path
from . import views


from django.contrib.sitemaps.views import sitemap
from main.sitemaps import ExamSitemap,SyllabusSitemap,PatternSitemap
sitemaps = {
    'exams': ExamSitemap,
    'syllabus': SyllabusSitemap,
    'pattern':PatternSitemap
}

urlpatterns = [
    path('', views.homepage, name='home'),
    path('search/', views.search_exam, name='search_exam'),
    path('all-exams/', views.all_exams, name='all-exams'),
    path('exam-detail/<str:exam_name>/', views.exam_detail, name='exam-detail'),
    path('category-data/<str:category_name>/', views.category_data, name='category-data'),
    path('get-categories/', views.get_categories, name='get-categories'),
    path('download-syllabus/<str:exam_name>/', views.download_syllabus, name='download-syllabus'),
    path('download-pattern/<str:exam_name>/', views.download_pattern, name='download-pattern'),
    path('compare_syllabus/', views.compare_syllabus, name='compare-syllabus'),
    path('test/',views.just_say,name='test'),
    path('sitemap.xml', sitemap, {'sitemaps': sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('static_sitemap.xml', views.serve_static_sitemap, name='static_sitemap'),

    



   

    


]


    # Other URL patterns if needed
