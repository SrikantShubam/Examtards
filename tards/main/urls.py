from django.urls import path
from . import views


urlpatterns = [
    path('', views.homepage, name='home'),
    path('search/', views.search_exam, name='search_exam'),
   
    path('exam-detail/<str:exam_name>/', views.exam_detail, name='exam-detail'),
    path('category-data/<str:category_name>/', views.category_data, name='category-data'),
    path('get-categories/', views.get_categories, name='get-categories'),
]


    # Other URL patterns if needed
