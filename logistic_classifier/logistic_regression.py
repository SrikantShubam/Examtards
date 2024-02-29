import json
import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import f1_score, recall_score
# import math

# Load JSON data
with open('./training-set/result.json', 'r') as f:
    data = json.load(f)

# Initialize lists to store features and labels

X = [[]]*len(data['images'])
y = [[]]*len(data['images'])

# print(X,'\n', y)

# exit(1)
# Define function to load and preprocess images

def preprocess_image(image_path, bbox):
    image = cv2.imread(image_path)
    # cv2.imshow('image', image) 
    # image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    # cv2.imshow('image', image) 
    # Extract region of interest using bounding box
    marginX = 50
    marginY = 5
    x, y, w, h = [int(x) for x in bbox]
    # print(bbox)
    y_start = y-marginY if(y-marginY>=0) else y
    y_end = y+h+marginY if(y+marginY<len(image)) else y+h

    x_start = x-marginX if(x-marginX>=0) else x
    x_end = x+w+marginX if(x+marginX<len(image[0])) else x+w
    # print(len(image[0]))    # x
    # print(len(image))   # y
    # print(image_path)

    roi = image[y:y+h, x:x+w]

    background = np.zeros(image.shape, dtype=np.uint8)
    background[0:h, 0:w] = roi
    # cv2.imshow('background', background) 
    # # img_mask = cv2.bitwise_and(image, roi)
    # # cv2.imshow('roi', roi)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows() 
    return roi

def augment_image(image):
    augmented_images = []
    
    # Flip vertically
    flipped_image = np.flip(image, 0)
    augmented_images.append(flipped_image)
    
    # Rotate image by 90 degrees
    rotated_image = np.rot90(image)
    augmented_images.append(rotated_image)
    
    # # Rotate image by 15 degrees

    from scipy.ndimage import rotate
    rotated_image = rotate(image, angle=15, reshape=False)
    augmented_images.append(rotated_image)

    rotated_image = rotate(image, angle=-15, reshape=False)
    augmented_images.append(rotated_image)
    
    return augmented_images

def get_seg_mask(image_path, bbox):
    return 


max_shape = ()
# Iterate through annotations to extract features and labels
for annotation in data['annotations']:
    image_id = annotation['image_id']
    category_id = annotation['category_id']
    bbox = annotation['bbox']
    area = annotation['area']

    image_info = []
    for img_metadata in data['images']:
        if img_metadata["id"] == image_id:
            image_info = img_metadata
            break
    image_path = os.path.join(os.getcwd(),'training-set', image_info['file_name'])
    # print(image_path)
    # Load and preprocess image
    # roi = preprocess_image(image_path, bbox)
    img = cv2.imread(image_path)
    max_shape = max(max_shape, np.array(img).shape)

    # extracting features
    
    X[image_id].append([int(x) for x in bbox])
    
    # Append category label to y
    y[image_id].append(category_id)

train_X = []
train_Y = []

print(max_shape)
# for i in range(len(X)):
for i in range(len(X)):
    image_info = []
    for img_metadata in data['images']:
        if img_metadata["id"] == i:
            image_info = img_metadata
            break
    image_path = os.path.join(os.getcwd(),'training-set', image_info['file_name'])
    # print(image_path)
    image = cv2.imread(image_path)
    image_shape = np.array(image).shape
    background = np.zeros(max_shape, dtype=np.uint8)
    background[0:image_shape[0], 0:image_shape[1]] = image

    image=background
    # image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    bbox_list = X[i]
    print(image.shape)
    # print(y[image_id])
    
    seg_mask_map = np.zeros(image.shape[:2], dtype=np.uint8)
    # print(y[i][index])
    for index in range(len(bbox_list)):
        label = y[i][index]
        bbox = bbox_list[index]
        # roi = preprocess_image(image_path, bbox)
        # x, y, w, h = bbox
        seg_mask_map[bbox[1]:bbox[1]+bbox[3], bbox[0]:bbox[0]+bbox[2]] = label+1 # 1 is option 2 is question 0 is nothing
        index+=1
    # print(seg_mask_map)
    train_X.append(np.array(image).flatten())
    train_Y.append(seg_mask_map.flatten())

# exit(1)
# Convert lists to numpy arrays
train_X = np.array(train_X)
# X = np.reshape(X.shape[1],-1)
# n1, nx, ny = X.shape
# X = np.reshape(X, (n1, nx*ny))
train_Y = np.array(train_Y)
print(train_X.shape)
print(train_Y.shape)


# Computationally very expensive
exit(1)

# print(X,'\n', y)
# Split data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(train_X, train_Y, test_size=0.2, random_state=42)

# Initialize logistic regression model

# logistic_reg = LogisticRegression(max_iter=5000)

# n_estimators_list = [570,585] ->570 max

# exit(1)
# for n in range(n_estimators_list):
randomForest = RandomForestClassifier(n_estimators=10, random_state=42)

# Train the model
randomForest.fit(X_train, y_train)

import joblib

# Save the trained model
joblib.dump(randomForest, 'random_forest_model.pkl')

y_pred = randomForest.predict(X_test)


f1 = f1_score(y_test, y_pred, average='weighted')
recall = recall_score(y_test, y_pred, average='weighted')
# Evaluate the model
accuracy = randomForest.score(X_test, y_test)
print("Accuracy:", accuracy)
print("F1:", f1)
print("Recall:", recall)

#   result_list.append({"n_value": n, "accuracy": accuracy, "f1": f1, "recall": recall})

# print(result_list)

from sklearn.metrics import confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

conf_matrix = confusion_matrix(y_test, y_pred)

# Plot confusion matrix
plt.figure(figsize=(8, 6))
sns.heatmap(conf_matrix, annot=True, fmt='d', cmap="Blues", xticklabels=['Class 1', 'Class 2'], yticklabels=['Class 1', 'Class 2'])
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()