import numpy as np
from sklearn.preprocessing import StandardScaler

# Assuming scaler is trained on training data for scaling purposes (replace with your actual scaler)
scaler = StandardScaler()

def preprocess(input_data, model_type):
    """
    Preprocess the input data to convert it into the format expected by the ML models.
    :param input_data: The raw input data (list of features).
    :param model_type: "price" for price prediction or "delay" for delay prediction.
    """
    input_data = np.array(input_data).reshape(1, -1)  # Reshape for model input
    
    if model_type == "price":
        # For price model, you may need to scale or encode the input
        input_data = scaler.transform(input_data)  # Assuming scaling is necessary
    # You can add other preprocessing steps if needed (e.g., one-hot encoding)
    
    return input_data

def postprocess(prediction, model_type):
    """
    Postprocess the model prediction to make it user-friendly.
    :param prediction: The raw output from the model.
    :param model_type: "price" or "delay" to adjust the output.
    """
    if model_type == "price":
        # Return price prediction directly
        return {"predicted_price": round(prediction[0], 2)}
    
    elif model_type == "delay":
        # Return delay prediction in a human-readable format
        if prediction[0] == 1:
            return {"delay_prediction": "Delayed"}
        else:
            return {"delay_prediction": "On time"}
