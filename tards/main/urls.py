from django.urls import path
from . import views

urlpatterns = [
    path('', views.homepage, name='home'),
    path('search/', views.search_exam, name='search_exam'),
   
    path('exam-detail/<str:exam_name>/', views.exam_detail, name='exam-detail'),

    # Other URL patterns if needed
]
