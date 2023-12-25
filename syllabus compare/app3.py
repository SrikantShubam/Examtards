from fuzzywuzzy import fuzz

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

exam1={
  "Physics": [
    "PHYSICS AND MEASUREMENT",
    "KINEMATICS",
    "LAWS OF MOTION",
    "WORK, ENERGY, AND POWER",
    "ROTATIONAL MOTION",
    "GRAVITATION",
    "PROPERTIES OF SOLIDS AND LIQUIDS",
    "THERMODYNAMICS",
    "KINETIC THEORY OF GASES",
    "OSCILLATIONS AND WAVES",
    "ELECTROSTATICS",
    "CURRENT ELECTRICITY",
    "MAGNETIC EFFECTS OF CURRENT AND MAGNETISM",
    "ELECTROMAGNETIC INDUCTION AND ALTERNATING CURRENTS",
    "ELECTROMAGNETIC WAVES",
    "OPTICS",
    "DUAL NATURE OF MATTER AND RADIATION",
    "ATOMS AND NUCLEI",
    "ELECTRONIC DEVICES",
    "EXPERIMENTAL SKILL"
  ],
  "Chemistry": [
    "SOME BASIC CONCEPTS IN CHEMISTRY",
    "ATOMIC STRUCTURE",
    "CHEMICAL BONDING AND MOLECULAR STRUCTURE",
    "CHEMICAL THERMODYNAMICS",
    "SOLUTIONS",
    "EQUILIBRIUM",
    "CHEMICAL KINETICS",
    "REDOX REACTIONS AND ELECTROCHEMISTRY",
    "CLASSIFICATION OF ELEMENTS AND PERIODICITY IN PROPERTIES",
    "P-BLOCK ELEMENTS",
    "D- AND F- BLOCK ELEMENTS",
    "COORDINATION COMPOUNDS",
    "PURIFICATION AND CHARACTERIZATION OF ORGANIC COMPOUNDS",
    "SOME BASIC PRINCIPLES OF ORGANIC CHEMISTRY",
    "HYDROCARBONS",
    "ORGANIC COMPOUNDS CONTAINING HALOGENS",
    "ORGANIC COMPOUNDS CONTAINING OXYGEN",
    "ORGANIC COMPOUNDS CONTAINING NITROGEN",
    "BIOMOLECULES",
    "PRINCIPLES RELATED TO PRACTICAL CHEMISTRY"
  ],
  "Biology": [
    "Diversity in Living World",
    "Structural Organisation in Animals and Plants",
    "Cell Structure and Function",
    "Plant Physiology",
    "Human Physiology",
    "Reproduction",
    "Genetics and Evolution",
    "Biology and Human Welfare",
    "Biotechnology and Its Applications",
    "Ecology and Environment"
  ]
}

exam2={
  "Mathematics": [
    "SETS, RELATIONS, AND FUNCTIONS",
    "COMPLEX NUMBERS AND QUADRATIC EQUATIONS",
    "MATRICES AND DETERMINANTS",
    "PERMUTATIONS AND COMBINATIONS",
    "BINOMIAL THEOREM AND ITS SIMPLE APPLICATIONS",
    "SEQUENCE AND SERIES",
    "LIMIT, CONTINUITY, AND DIFFERENTIABILITY",
    "INTEGRAL CALCULUS",
    "DIFFERENTIAL EQUATIONS",
    "COORDINATE GEOMETRY",
    "THREE DIMENSIONAL GEOMETRY",
    "VECTOR ALGEBRA",
    "STATISTICS AND PROBABILITY",
    "TRIGONOMETRY"
  ],
  "Physics": [
    "PHYSICS AND MEASUREMENT",
    "KINEMATICS",
    "LAWS OF MOTION",
    "WORK, ENERGY, AND POWER",
    "ROTATIONAL MOTION",
    "GRAVITATION",
    "PROPERTIES OF SOLIDS AND LIQUIDS",
    "THERMODYNAMICS",
    "KINETIC THEORY OF GASES",
    "OSCILLATIONS AND WAVES",
    "ELECTROSTATICS",
    "CURRENT ELECTRICITY",
    "MAGNETIC EFFECTS OF CURRENT AND MAGNETISM",
    "ELECTROMAGNETIC INDUCTION AND ALTERNATING CURRENTS",
    "ELECTROMAGNETIC WAVES",
    "OPTICS",
    "DUAL NATURE OF MATTER AND RADIATION",
    "ATOMS AND NUCLEI",
    "ELECTRONIC DEVICES",
    "EXPERIMENTAL SKILLS"
  ],
  "Chemistry": [
    "SOME BASIC CONCEPTS IN CHEMISTRY",
    "ATOMIC STRUCTURE",
    "CHEMICAL BONDING AND MOLECULAR STRUCTURE",
    "CHEMICAL THERMODYNAMICS",
    "SOLUTIONS",
    "EQUILIBRIUM",
    "REDOX REACTIONS AND ELECTROCHEMISTRY",
    "CHEMICAL KINETICS",
    "CLASSIFICATION OF ELEMENTS AND PERIODICITY IN PROPERTIES",
    "P-BLOCK ELEMENTS",
    "d - and f- BLOCK ELEMENTS",
    "COORDINATION COMPOUNDS",
    "PURIFICATION AND CHARACTERISATION OF ORGANIC COMPOUNDS",
    "SOME BASIC PRINCIPLES OF ORGANIC CHEMISTRY",
    "HYDROCARBONS",
    "ORGANIC COMPOUNDS CONTAINING HALOGENS",
    "ORGANIC COMPOUNDS CONTAINING OXYGEN",
    "ORGANIC COMPOUNDS CONTAINING NITROGEN",
    "BIOMOLECULES",
    "PRINCIPLES RELATED TO PRACTICAL CHEMISTRY"
  ]
}

def compare_exams(exam1,exam2):
    def extract_topics(exam):
        subjects = {}
        for subject, topics in exam.items():
            subjects[subject] = set(topics)
        return subjects

    def find_similar_strings(base_string, strings_to_compare):
        similar_strings = []
        for string in strings_to_compare:
            if fuzz.ratio(base_string.lower(), string.lower()) > 80:  # Adjust ratio threshold as needed
                similar_strings.append(string)
        return similar_strings

    exam1_topics = extract_topics(exam1)
    exam2_topics = extract_topics(exam2)

    common_subjects = set(exam1_topics.keys()) & set(exam2_topics.keys())
    unique_subjects_exam1 = set(exam1_topics.keys()) - common_subjects
    unique_subjects_exam2 = set(exam2_topics.keys()) - common_subjects

    common_subject_similarity = {}
    unique_subjects_similarity = {}
    common_topics = {}

    for subject in common_subjects:
        common_topics[subject] = list(exam1_topics[subject] & exam2_topics[subject])
        common_subject_similarity[subject] = fuzz.token_set_ratio(' '.join(exam1_topics[subject]), ' '.join(exam2_topics[subject]))

    for subject in unique_subjects_exam1:
        unique_subjects_similarity[subject] = 0

    for subject in unique_subjects_exam2:
        unique_subjects_similarity[subject] = 0
    final_common_similarity_score = sum(common_subject_similarity.values()) / len(common_subject_similarity)


    final_common_similarity_score = sum(common_subject_similarity.values()) / len(common_subject_similarity)
   


    def calculate_cosine_similarity(topics1, topics2):
        tfidf_vectorizer = TfidfVectorizer()
        tfidf_matrix = tfidf_vectorizer.fit_transform(topics1 + topics2)
        similarity_matrix = cosine_similarity(tfidf_matrix)
        return similarity_matrix[:len(topics1), len(topics1):]

    def calculate_jaccard_similarity(topic1, topic2):
        set1 = set(topic1.split())
        set2 = set(topic2.split())
        return len(set1.intersection(set2)) / len(set1.union(set2))

    # Combine all topics for each subject
    combined_topics_exam1 = [' '.join(exam1[subject]) for subject in exam1]
    combined_topics_exam2 = [' '.join(exam2[subject]) for subject in exam2]

    # Calculate cosine similarity for all subjects
    cosine_similarity_matrix = calculate_cosine_similarity(combined_topics_exam1, combined_topics_exam2)

    # Calculate Jaccard similarity for all subjects
    jaccard_similarity_scores = {
        subject: calculate_jaccard_similarity(combined_topics_exam1[i], combined_topics_exam2[i])
        for i, subject in enumerate(exam1)
    }

    # Combine and aggregate the similarity scores
    # Example: Calculating a weighted average of both scores
    weighted_similarity_scores = {
        subject: 0.5 * cosine_similarity_matrix[i] + 0.5 * jaccard_similarity_scores[subject]
        for i, subject in enumerate(exam1)
    }

    # Calculate the final overall similarity score by averaging the aggregated scores
    final_similarity_score = sum(weighted_similarity_scores.values()) / len(weighted_similarity_scores)
    #needed
    # print(f"Common Subjects: {common_subjects}")
    # print(f"Common Subject Similarity Score: {common_subject_similarity}")
    # print(f"Unique Subjects in Exam 1: {unique_subjects_exam1}")
    # print(f"Unique Subjects in Exam 2: {unique_subjects_exam2}")
    # print(f"Common Topics: {common_topics}")
    # print(f"Total Common subjects Similarity Score: {final_common_similarity_score}")
    # print("Final Similarity Score:", final_similarity_score.sum())
    return { "common_subjects":common_subjects,"common subject similarity score":common_subject_similarity,"unique subjects in exam 1":
            unique_subjects_exam1,"Unique Subjects in Exam 2":unique_subjects_exam2,"common topics":common_topics,"common subjects similarity score"
            :final_common_similarity_score,"Final Similarity Score": final_similarity_score.sum()}



comparison_result = compare_exams(exam1, exam2)
print(comparison_result)