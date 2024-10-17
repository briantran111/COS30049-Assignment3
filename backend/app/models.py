import joblib

# Load the trained models
poly_model = joblib.load('ml_models/linear_regression_model.pkl')
rf_model = joblib.load('ml_models/random_forest_model.pkl')

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
