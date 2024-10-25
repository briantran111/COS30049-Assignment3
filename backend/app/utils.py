import numpy as np
from sklearn.preprocessing import RobustScaler, PolynomialFeatures

# Assuming scaler is trained on training data for scaling purposes (replace with your actual scaler)


def preprocess_input(data, scaler, poly=None):
    """
    Applies scaling and optional polynomial transformation to input data.
    
    Parameters:
        data (numpy array): Input data to preprocess.
        scaler (RobustScaler): Fitted scaler to normalize data.
        poly (PolynomialFeatures, optional): Fitted polynomial transformer.

    Returns:
        numpy array: Preprocessed data (scaled and optionally polynomial transformed).
    """
    # Apply scaling
    data_scaled = scaler.transform(data)
    
    # Apply polynomial transformation if provided
    if poly:
        data_poly = poly.transform(data_scaled)
        return data_poly

    return data_scaled

def prepare_input(input_data: dict, feature_names: list):
    """
    Converts request data from the FastAPI request to a numpy array for model input.
    
    Parameters:
        request_data (dict): Dictionary of input features from the request.

    Returns:
        numpy array: Prepared data for model input.
    """
    # Extract feature values from request data and convert to numpy array
    input_array = np.zeros(len(feature_names))

    # Set values from the input data
    for i, feature in enumerate(feature_names):
        if feature in input_data:
            input_array[i] = input_data[feature]

    return input_array.reshape(1, -1)
