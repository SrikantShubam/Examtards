import PyPDF2
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
import string
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.metrics import jaccard_score
def extract_text_from_pdf(pdf_file):
    text = ""
    with open(pdf_file, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)
        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]  # Updated method to access pages
            text += page.extract_text()
    return text

# Replace 'file_path_1' and 'file_path_2' with the paths to your PDF files
file_path_1 = 'iit jee mains.pdf'
file_path_2 = 'neet.pdf'

text_from_exam1 = extract_text_from_pdf(file_path_1)
text_from_exam2 = extract_text_from_pdf(file_path_2)

print("Text from Exam 1:")
# print(text_from_exam1[:500])  # Displaying the first 500 characters as an example
print("\nText from Exam 2:")
print(text_from_exam2)  # Displaying the first 500 characters as an example



# Download NLTK resources (uncomment these lines if not downloaded already)
# nltk.download('punkt')
# nltk.download('stopwords')

def preprocess_text(text):
    # Tokenization
    tokens = word_tokenize(text.lower())

    # Remove punctuation and non-alphabetic characters
    table = str.maketrans('', '', string.punctuation)
    stripped = [w.translate(table) for w in tokens if w.isalpha()]

    # Remove stopwords
    stop_words = set(stopwords.words('english'))
    filtered_words = [word for word in stripped if word not in stop_words]

    # Stemming (reducing words to their root form)
    stemmer = PorterStemmer()
    stemmed_words = [stemmer.stem(word) for word in filtered_words]

    # Join the processed words back into a single string
    processed_text = ' '.join(stemmed_words)

    return processed_text

# Example text for preprocessing (replace this with your extracted text)

# Preprocess the example text
processed_text = preprocess_text(text_from_exam1)
processed_text2 = preprocess_text(text_from_exam2)
# print("Processed Text:")
# print(len(processed_text))
# print(len(text_from_exam1))


# Create a list of preprocessed texts
preprocessed_texts = [processed_text, processed_text2]

# Initialize TfidfVectorizer
tfidf_vectorizer = TfidfVectorizer()

# # Fit and transform the preprocessed texts
tfidf_matrix = tfidf_vectorizer.fit_transform(preprocessed_texts)

# # Get feature names (words) from the vectorizer
feature_names = tfidf_vectorizer.get_feature_names_out()

cosine_sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])

# # Convert TF-IDF matrix to sets for Jaccard similarity calculation
tfidf_set_1 = set(tfidf_matrix[0].nonzero()[1])
tfidf_set_2 = set(tfidf_matrix[1].nonzero()[1])

# # Calculate Jaccard similarity
jaccard_sim = len(tfidf_set_1.intersection(tfidf_set_2)) / len(tfidf_set_1.union(tfidf_set_2))

# # Display similarity scores
print("Cosine Similarity:", cosine_sim[0][0])
print("Jaccard Similarity:", jaccard_sim)

# # ... (previous code remains unchanged up to the point where cosine_sim is calculated)

# # Define a lower threshold
threshold = 0.05  # Lower threshold value

# # Identify common topics (words with non-zero TF-IDF scores in both texts)
common_topics = [feature_names[idx] for idx, score in enumerate(tfidf_matrix.toarray()[0])
                 if score > threshold and feature_names[idx] in tfidf_matrix[1].nonzero()[1]]

# # Display common topics
#print("Common Topics:")
# print(common_topics)


# # Identify unique topics in each text
# unique_topics_1 = [feature_names[idx] for idx, score in enumerate(tfidf_matrix.toarray()[0])
#                    if score > threshold and feature_names[idx] not in tfidf_matrix[1].nonzero()[1]]
# unique_topics_2 = [feature_names[idx] for idx, score in enumerate(tfidf_matrix.toarray()[1])
#                    if score > threshold and feature_names[idx] not in tfidf_matrix[0].nonzero()[1]]

# # Display common and unique topics
# top_n = 10  # Set the number of top words to retrieve
# similarity_scores = tfidf_matrix[0].multiply(tfidf_matrix[1]).toarray()[0]
# top_similar_indices = similarity_scores.argsort()[-top_n:][::-1]
# feature_names = tfidf_vectorizer.get_feature_names_out()

# common_topics = [feature_names[idx] for idx in top_similar_indices]

# Display common topics
print("Cosine Similarity:", cosine_sim[0][0])
# print("Common Topics:")
# print(common_topics)
