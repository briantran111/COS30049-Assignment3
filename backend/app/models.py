import os
import pickle
import joblib
import numpy as np

# Load the trained models
ml_models_dir = os.path.join(os.path.dirname(__file__), '../ml_models')

os.makedirs(ml_models_dir, exist_ok=True)

def save_model(model, filename):
    with open(os.path.join(ml_models_dir, filename), 'wb') as file:
        pickle.dump(model, file)

def load_model(filename):
    with open(os.path.join(ml_models_dir, filename), 'rb') as file:
        return pickle.load(file)

# Save all models: Ridge, Random Forest, Scaler, and Polynomial Features
def save_all_models(ridge_model, scaler, poly, rf_model):
    save_model(ridge_model, 'ridge_model.pkl')
    save_model(scaler, 'scaler.pkl')
    save_model(poly, 'poly_features.pkl')
    save_model(rf_model, 'random_forest_model.pkl')

# Load all models: Ridge, Random Forest, Scaler, and Polynomial Features
def load_all_models():
    ridge_model = load_model('ridge_model.pkl')
    scaler = load_model('scaler.pkl')
    poly = load_model('poly_features.pkl')
    rf_model = load_model('random_forest_model.pkl')
    return ridge_model, scaler, poly, rf_model
