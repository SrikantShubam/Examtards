from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .forms import ExamSearchForm
from utilities.exam_comparison import compare_exams
from .serializers import ExamSerializer
from fuzzywuzzy import fuzz
from django.shortcuts import render, get_object_or_404

from django.http import JsonResponse,FileResponse
from .models import Exam, SyllabusFile, PatternFile,Category
from urllib.parse import unquote_plus
from django.http import HttpResponse

import requests
def homepage(request):
    return render(request, 'index.html')  

@api_view(['GET'])
def search_exam(request):
    form = ExamSearchForm(request.GET)
    exams = []

    if form.is_valid():
        search_query = form.cleaned_data['search_query'].lower()
        all_exams = Exam.objects.all()

        # Use fuzzy matching to filter exams
        threshold = 75  # Define a threshold for fuzzy matching (you can adjust this)
        exams = [
            exam for exam in all_exams
            if fuzz.token_set_ratio(search_query, exam.name.lower()) > threshold
        ]
    print("kuch toh mila hai")
    serializer = ExamSerializer(exams, many=True)
    print(serializer.data)
    return Response(serializer.data)




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

    
@api_view(['GET'])
def get_categories(request):
    try:
        # Get distinct category names from the Category model
        categories = Exam.category.through.objects.values_list('category__name', flat=True).distinct()
        return Response({'categories': list(categories)})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    

    
@api_view(['GET'])
def category_data(request, category_name):
    try:
        # Get the Category object by its name
        category = Category.objects.get(name=category_name)
        
        # Filter data based on the related Category object
        queryset = Exam.objects.filter(category=category)
        serializer = ExamSerializer(queryset, many=True)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({"message": "Category not found"}, status=404)
    except Exam.DoesNotExist:
        return Response({"message": "No data found for the given category"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    
    
# @api_view(['GET'])
# def download_syllabus(request, exam_name):
#     decoded_exam_name = unquote_plus(exam_name)
#     exam = Exam.objects.filter(name__iexact=decoded_exam_name.replace('-', ' ')).first()

#     if not exam:
#         return JsonResponse({"message": "Exam not found."}, status=404)

#     syllabus = SyllabusFile.objects.filter(exam=exam).first()

#     if not syllabus:
#         return JsonResponse({"message": "No syllabus found for this exam."}, status=404)

#     try:
#         response = FileResponse(open(syllabus.file_path, 'rb'))
#         response['Content-Disposition'] = f'attachment; filename="{syllabus.file_name}"'
#         return response
#     except FileNotFoundError:
#         return JsonResponse({"message": "Syllabus file not found."}, status=404)

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


# @api_view(['GET']) 
# def compare_syllabus(request):
#     if request.method == 'GET':
#         print(request)
#         # selected_exam_names = request.GET.getlist('selected_exam_names[]')  # Receive selected exam names

#         # # Fetch syllabus data for the selected exams
#         # syllabus_data = {}
#         # for exam_name in selected_exam_names:
#         #     try:
#         #         exam = Exam.objects.get(name=exam_name)
#         #         syllabus_data[exam_name] = exam.syllabus
#         #     except Exam.DoesNotExist:
#         #         syllabus_data[exam_name] = None  # Handle case where exam name doesn't exist

#         # # Get syllabus for exam1 and exam2
#         # syllabus_exam1 = syllabus_data.get(selected_exam_names[0])
#         # syllabus_exam2 = syllabus_data.get(selected_exam_names[1])

#         # # Call compare_syllabus function with syllabus data of both exams
#         # comparison_result = compare_exams(syllabus_exam1, syllabus_exam2)

#         # # Return comparison result as JSON response
#         # return JsonResponse({'comparison_result': comparison_result})

#     return JsonResponse({'error': 'Invalid request method'})


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