import fitz
import re
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from fuzzywuzzy import fuzz

import fitz  # PyMuPDF

def extract_top_level_topics(pdf_file):
    topics = []
    doc = fitz.open(pdf_file)

    for page_num in range(len(doc)):
        page = doc.load_page(page_num)
        text = page.get_text()

        # Split text based on certain patterns (e.g., lines containing 'UNIT' in uppercase)
        lines = text.split('\n')

        for line in lines:
            # Capture lines containing "UNIT" (case insensitive)
            if 'UNIT' in line.upper():
                topics.append(line.strip())

     
  

    doc.close()
    return topics

def clean_list_items(input_list):
    cleaned_list = []
    words_to_remove = {'unit', 'paper', 'and'}  # Add more words as needed
    punctuation_to_remove = r'[^\w\s-]'  # Regex pattern to remove punctuation except spaces and hyphens
    
    for item in input_list:
        # Convert to lowercase and remove specified words and numbers
        cleaned_item = ' '.join(word for word in item.lower().split() if word.lower() not in words_to_remove)
        # Remove punctuation except hyphens
        cleaned_item = re.sub(punctuation_to_remove, '', cleaned_item)
        # Remove Roman numerals and numbers
        cleaned_item = re.sub(r'\b(?:[MDCLXVI]+\b|\b\d+\b)', '', cleaned_item)
        # Remove 'unit-' if it occurs at the beginning of the word
        cleaned_item = re.sub(r'\bunit-\s*', '', cleaned_item)
        cleaned_list.append(cleaned_item)
    
    return cleaned_list
def filter_items_with_unit(list_of_items):
    return [item for item in list_of_items if 'UNIT' in item]

# Replace 'file_path_1' and 'file_path_2' with the paths to your PDF files
file_path_1 = 'iit jee mains.pdf'
file_path_2 = 'neet.pdf'

# Extract top-level topics from PDFs

exam1=extract_top_level_topics(file_path_1)
# filtered_list = filter_items_with_unit(exam1)
print(exam1)
# top_level_topics_from_exam1 = clean_list_items(exam1)
# exam2=extract_top_level_topics(file_path_2)
# filtered_list = filter_items_with_unit(exam2)

# top_level_topics_from_exam2 = clean_list_items(filtered_list)

from sklearn.metrics.pairwise import cosine_similarity
from nltk.tokenize import word_tokenize
# topics_list_1=top_level_topics_from_exam1
# topics_list_2=top_level_topics_from_exam2
# print(topics_list_1)
# print(len(topics_list_2))

# # Tokenize and preprocess topics
# tokenize = lambda x: ' '.join(word_tokenize(x.lower()))

# # preprocessed_topics_list_1 = [tokenize(topic) for topic in topics_list_1]
# # preprocessed_topics_list_2 = [tokenize(topic) for topic in topics_list_2]

# # Create TF-IDF vectorizer
# vectorizer = TfidfVectorizer()

# # Fit and transform the topics into TF-IDF vectors
# tfidf_matrix = vectorizer.fit_transform(preprocessed_topics_list_1 + preprocessed_topics_list_2)

# # Calculate cosine similarity using TF-IDF vectors
# cosine_sim = cosine_similarity(tfidf_matrix[:len(topics_list_1)], tfidf_matrix[len(topics_list_1):])

# # Find common topics based on cosine similarity threshold
# threshold = 0.8  # Adjust threshold as needed (value ranges from -1 to 1)
# common_topics_indices = [(i, j) for i, row in enumerate(cosine_sim) for j, val in enumerate(row) if val >= threshold]

# common_topics = [topics_list_1[i] for i, _ in common_topics_indices]
# unique_topics_list_1 = [topics_list_1[i] for i in range(len(topics_list_1)) if i not in [idx for idx, _ in common_topics_indices]]
# unique_topics_list_2 = [topics_list_2[j] for _, j in common_topics_indices]

# # print(f"Common Topics: {common_topics}")
# # print(f"Unique Topics in List 1: {unique_topics_list_1}")
# # print(f"Unique Topics in List 2: {unique_topics_list_2}")


