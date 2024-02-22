import cv2
import PyPDF2 
import pytesseract
from pytesseract import Output
import re
from io import BytesIO

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'


def extract_questions_and_options(text):
    # Define regular expressions for questions and options
    question_pattern = r'(?<!\S)\w+(?!\S)[A-Za-z0-9\s?.,\'"!@#$%^&*()_+-=<>;:{}\[\]\|\\`~]*\?'
    option_pattern = r'(?<!\S)\w+(?!\S)[A-Za-z0-9\s?.,\'"!@#$%^&*()_+-=<>;:{}\[\]\|\\`~]*[a-zA-Z0-9]\.'

    # Find all questions and options in the text
    questions = re.findall(question_pattern, text)
    options = re.findall(option_pattern, text)

    # Store questions and options in a dictionary
    result = {
        'questions': questions,
        'options': options
    }

    return result

def extract_text_from_image(image_path):
    # Read the image using OpenCV
    image = cv2.imread(image_path)

    # Convert the image to grayscale
    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Use thresholding to preprocess the image
    _, threshold_image = cv2.threshold(gray_image, 150, 255, cv2.THRESH_BINARY_INV)


    ### Image to sub-parts , contours with margin around text
    contours, _ = cv2.findContours(threshold_image, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    extracted_text = []

    # for cropping for sub-page

    for contour in contours:
        # Get the bounding box of the contour
        x, y, w, h = cv2.boundingRect(contour)

        # Add a margin around the bounding box
        margin = 10
        x -= margin
        y -= margin
        w += 2 * margin
        h += 2 * margin

        # Crop the image around the bounding box
        cropped_image = image[y:y+h, x:x+w]

        # Use pytesseract to perform OCR on the cropped image
        custom_config = r'--oem 3 --psm 6'  # OCR Engine Mode (OEM) 3 for both standard and LSTM OCR, Page Segmentation Mode (PSM) 6 for sparse text
        text = pytesseract.image_to_string(cropped_image, config=custom_config)

        # Append the extracted text to the list
        extracted_text.append(text)

    return '\n'.join(extracted_text)

def extract_data_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        num_pages = len(pdf_reader.pages)

        extracted_data = []

        for page_num in range(num_pages):
            page = pdf_reader.pages[page_num]
            text = page.extract_text()

            # Use OpenCV to read text from the image if PDF is a scanned document
            # print(page.images[0])
            if not text.strip() and page.images:
                image_snippets = []

                for img_index, img_info in enumerate(page.images):
                    image_obj = img_info.data
                    image_path = f"image_{page_num + 1}_{img_index + 1}.png"
                    # print(type(image_obj))
                    # pdf_writer.write(image_obj)
                    # image_obj.save(image_path)
                    with open(image_path, 'wb') as f:
                        f.write(image_obj)

                    image_snippet_text = extract_text_from_image(image_path)
                    image_snippets.append(image_snippet_text)
                # print(image_snippets)

                extracted_data.append({
                    'page_num': page_num + 1,
                    'text': text,
                    'image_snippets': image_snippets
                })
            else:
                extracted_data.append({
                    'page_num': page_num + 1,
                    'data': extract_questions_and_options(text)
                })

    return extracted_data

def main(file_name, destination_path="."):
    pdf_path = file_name  # Update with the path to your PDF file
    extracted_data = extract_data_from_pdf(pdf_path)
    file_name=file_name.split("/")[-1]

    import json
    json.dumps(extracted_data, indent=4)
    with open(f'{destination_path}/{file_name[:-4]}.json', 'w') as file:
        json.dump(extracted_data, file, indent=4)

if __name__ == "__main__":
    import sys
    if len(sys.argv) == 2:
        main(sys.argv[1])
