import os
import joblib

# Load the trained models
ml_models_dir = os.path.join(os.path.dirname(__file__), '../ml_models')

poly_model_path = os.path.join(ml_models_dir, 'linear_regression_model.pkl')
rf_model_path = os.path.join(ml_models_dir, 'random_forest_model.pkl')

try:
    poly_model = joblib.load(poly_model_path)
    rf_model = joblib.load(rf_model_path)
except FileNotFoundError as e:
    print(f"Error loading model: {e}")

def predict_price(input_data):
    """
    Make price predictions using the trained Linear Regression model.
    """
    prediction = poly_model.predict(input_data)  # Assuming input is properly preprocessed
    return prediction

def predict_delay(input_data):
    """
    Make delay predictions using the trained Random Forest Classifier.
    """
    prediction = rf_model.predict(input_data)
    return prediction
