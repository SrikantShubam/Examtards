import joblib, numpy as np, cv2

model = joblib.load('./random_forest_model.pkl')

def load_image(image_path):
    image = cv2.imread(image_path)
    # cv2.imshow('image', image) 
    image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY) 
    return image

# Convert lists to numpy arrays
X = np.array([np.array(load_image('./4ccb783f-cuet-ug-previous-year-question-paper-1_page-0008.jpg')).flatten()])
# X = np.reshape(X.shape[1],-1)
# n1, nx, ny = X.shape
print(X.shape)
# X = np.reshape(X, (n1, nx*ny))

print(model.predict(X))