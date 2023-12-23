


from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .forms import ExamSearchForm

from .serializers import ExamSerializer
from fuzzywuzzy import fuzz
from django.shortcuts import render, get_object_or_404
from urllib.parse import unquote
from django.http import JsonResponse,FileResponse
from .models import Exam, SyllabusFile
# from .models import Exam
from urllib.parse import unquote_plus

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
        # Get distinct category names from the Exam model
        categories = Exam.objects.values_list('category', flat=True).distinct()
        return Response({'categories': categories})
    except Exception as e:
        return Response({"error": str(e)}, status=500)
    

@api_view(['GET'])
def category_data(request, category_name):
    try:
        # Filter data based on the 'category' field in the Exam model
        queryset = Exam.objects.filter(category=category_name)
        serializer = ExamSerializer(queryset, many=True)
        print(serializer.data)
        return Response(serializer.data)
    except Exam.DoesNotExist:
        return Response({"message": "No data found for the given category"}, status=404)
    except Exception as e:
        return Response({"error": str(e)}, status=500)    
    

@api_view(['GET'])
def download_syllabus(request, exam_name):
    decoded_exam_name = unquote_plus(exam_name)
    exam = Exam.objects.filter(name__iexact=decoded_exam_name.replace('-', ' ')).first()

    if not exam:
        return JsonResponse({"message": "Exam not found."}, status=404)

    syllabus = SyllabusFile.objects.filter(exam=exam).first()

    if not syllabus:
        return JsonResponse({"message": "No syllabus found for this exam."}, status=404)

    try:
        response = FileResponse(open(syllabus.file_path, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{syllabus.file_name}"'
        return response
    except FileNotFoundError:
        return JsonResponse({"message": "Syllabus file not found."}, status=404)
