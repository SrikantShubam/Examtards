from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .forms import ExamSearchForm
from utilities.exam_comparison import compare_exams
from .serializers import ExamSerializer
from fuzzywuzzy import fuzz
from django.shortcuts import render, get_object_or_404
from collections import OrderedDict
from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse,FileResponse
from .models import Exam, SyllabusFile, PatternFile,Category
from urllib.parse import unquote_plus
from django.http import HttpResponse
from django.views.decorators.http import require_GET
from django.db.models import Value, CharField

import requests
def homepage(request):
    return render(request, 'index.html')  





@api_view(['GET'])
def search_exam(request):
    form = ExamSearchForm(request.GET)
    if form.is_valid():
        search_query = form.cleaned_data['search_query'].lower()
        all_exams = Exam.objects.all()

        # First, try to find an exact match (case-insensitive)
        exact_matches = [exam for exam in all_exams if exam.name.lower() == search_query]

        # If exact matches are found, return them
        if exact_matches:
            results = [{'name': exam.name, 'exam_date': exam.exam_date} for exam in exact_matches]
            return JsonResponse(results, safe=False)

        # If no exact match is found, use fuzzy matching to find the closest matches
        matching_exams = []
        threshold = 65  # Adjust the threshold as needed

        for exam in all_exams:
            ratio = fuzz.token_set_ratio(search_query, exam.name.lower())
            if ratio > threshold:
                matching_exams.append({'name': exam.name, 'exam_date': exam.exam_date})

        if matching_exams:
            # If matching exams are found, return them
            return JsonResponse(matching_exams, safe=False)

    return JsonResponse([], safe=False)



@api_view(['GET'])
def exam_detail(request, exam_name):
    try:
        
        print("OG NAME",exam_name)

        decoded_exam_name = unquote_plus(exam_name) 
        print(decoded_exam_name)
        exam = Exam.objects.filter(name__iexact=decoded_exam_name.replace('-', ' ')).first()
        if not exam:
            exam = get_object_or_404(Exam, name__iexact=decoded_exam_name)
        
        serializer = ExamSerializer(exam)
        return JsonResponse(serializer.data)  # Return JSON response directly
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    
# @api_view(['GET'])
# def get_categories(request):
#     try:
#         # Get distinct category names from the Category model
#         categories = Exam.category.through.objects.values_list('category__name', flat=True).distinct()
#         return Response({'categories': list(categories)})
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)
    
import logging
from django.db.models import Value, CharField

logger = logging.getLogger(__name__)
from rest_framework.renderers import JSONRenderer  # Import JSONRenderer

@api_view(['GET'])
def get_categories(request):
    try:
      
        categories = Category.objects.values_list('name', flat=True).distinct()

      
        categories = list(categories)
        
        categories.insert(0, 'upcoming')

        return Response({'categories': categories})
    except Exception as e:
        return Response({"error": str(e)}, status=500)


@require_GET
def serve_static_sitemap(request):
    xml_content = """<?xml version="1.0" encoding="UTF-8"?>
        <!-- created with www.mysitemapgenerator.com -->
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            <url>
                <loc>https://www.examtards.com/</loc>
                <lastmod>2024-01-16T11:18:07+01:00</lastmod>
                <priority>0.6</priority>
            </url>
            <url>
                <loc>https://www.examtards.com/exam-detail/</loc>
                <lastmod>2024-01-16T11:18:07+01:00</lastmod>
                <priority>0.8</priority>
            </url>
            <url>
                <loc>https://www.examtards.com/contact-us</loc>
                <lastmod>2024-01-16T11:18:07+01:00</lastmod>
                <priority>1.0</priority>
            </url>
            <url>
                <loc>https://www.examtards.com/disclaimer</loc>
                <lastmod>2024-01-16T11:18:07+01:00</lastmod>
                <priority>1.0</priority>
            </url>
            <url>
                <loc>https://www.examtards.com/compare-syllabus</loc>
                <lastmod>2024-01-16T11:18:07+01:00</lastmod>
                <priority>1.0</priority>
            </url>
        </urlset>
    """
    return HttpResponse(xml_content, content_type='application/xml')
    
# @api_view(['GET'])
# def category_data(request, category_name):
#     try:
#         # Get the Category object by its name
#         category = Category.objects.get(name=category_name)
        
#         # Filter data based on the related Category object
#         queryset = Exam.objects.filter(category=category)
#         serializer = ExamSerializer(queryset, many=True)
#         return Response(serializer.data)
#     except Category.DoesNotExist:
#         return Response({"message": "Category not found"}, status=404)
#     except Exam.DoesNotExist:
#         return Response({"message": "No data found for the given category"}, status=404)
#     except Exception as e:
#         return Response({"error": str(e)}, status=500)
    
from datetime import date, timedelta
from rest_framework import serializers
class ExamMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['name', 'exam_date']
@api_view(['GET'])
def category_data(request, category_name):
    try:
        if category_name.lower() == 'upcoming':
            # Calculate today's date
            today = date.today()

            # Calculate 60 days from today
            sixty_days_from_today = today + timedelta(days=60)

            # Get the exams with less than 60 days remaining until the exam date
            queryset = Exam.objects.filter(
                exam_date__gte=today,
                exam_date__lte=sixty_days_from_today
            ).order_by('exam_date')
        else:
            # Get the Category object by its name
            category = Category.objects.get(name=category_name)

            # Filter data based on the related Category object
            queryset = Exam.objects.filter(category=category).order_by('exam_date')

        # Serialize the queryset with the minimal serializer
        serializer = ExamMinimalSerializer(queryset, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({"message": "Category not found"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
def download_syllabus(request, exam_name):
    decoded_exam_name = unquote_plus(exam_name)
    exam = Exam.objects.filter(name__iexact=decoded_exam_name.replace('-', ' ')).first()

    if not exam:
        return JsonResponse({"message": "Exam not found."}, status=404, safe=False)


    syllabus = SyllabusFile.objects.filter(exam=exam).first()

    if not syllabus:
        return JsonResponse({"message": "No syllabus found for this exam."}, status=404)

    try:
        response = HttpResponse(requests.get(syllabus.file_path).content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{syllabus.file_name}"'
        return response
    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)
    


    

@api_view(['GET'])
def download_pattern(request, exam_name):
    decoded_exam_name = unquote_plus(exam_name)
    exam = Exam.objects.filter(name__iexact=decoded_exam_name.replace('-', ' ')).first()

    if not exam:
        return JsonResponse({"message": "Exam not found."}, status=404, safe=False)


    pattern = PatternFile.objects.filter(exam=exam).first()

    if not pattern:
        return JsonResponse({"message": "No pattern found for this exam."}, status=404)

    try:
        response = HttpResponse(requests.get(pattern.file_path).content, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{pattern.file_name}"'
        return response
    except Exception as e:
        return JsonResponse({"message": f"Error: {str(e)}"}, status=500)

@api_view(['GET'])
def all_exams(request):
    try:
        all_exam_names = Exam.objects.values_list('name', flat=True)
        return Response({'exam_names': list(all_exam_names)})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
@api_view(['GET']) 
def just_say(request):
    return Response('hey there')





@api_view(['GET']) 
def compare_syllabus(request):
    if request.method == 'GET':
        selected_exam_names = request.GET.getlist('selected_exam_names[]')  # Receive selected exam names


        if len(selected_exam_names) != 2:
            return JsonResponse({'error': 'Please select exactly two exams for comparison'})

        exam1_name = selected_exam_names[0]
        exam2_name = selected_exam_names[1]


   
        try:
            exam1 = Exam.objects.get(name=exam1_name)
            exam2=Exam.objects.get(name=exam2_name)
            # print(exam1.syllabus)
            # print("the type",type(exam1),type(exam1.syllabus))
           
            # print("exam 1 name : ",exam1)
            if not exam1.syllabus :
                print("lag gaye 1 ")
                return JsonResponse({'error': 'We do not have syllabus for {}'.format(exam1_name)})
            if not exam2.syllabus :
                print("lag gaye 2 ")

                return JsonResponse({'error': 'We do not have syllabus for {}'.format(exam2_name)})
            
            res=compare_exams(exam1.syllabus,exam2.syllabus)
           
            return Response(res)

        except Exam.DoesNotExist:
            return JsonResponse({'error': 'One or both exams do not exist'})

    return JsonResponse({'error': 'Invalid request method'})





@api_view(['GET'])
def upcoming_exams(request):
    try:
        # Calculate today's date
        today = date.today()

        # Calculate 60 days from today
        sixty_days_from_today = today + timedelta(days=60)

        # Get the exams with less than 60 days remaining until the exam date
        upcoming_exams = Exam.objects.filter(
            exam_date__gte=today,
            exam_date__lte=sixty_days_from_today
        ).order_by('exam_date')

        serializer = ExamSerializer(upcoming_exams, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response({"error": str(e)}, status=500)