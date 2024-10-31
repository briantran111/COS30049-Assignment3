import numpy as np
import datetime
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
    input_array = np.zeros(len(feature_names))

    if 'selectedDate' in input_data:
        selected_date = datetime.datetime.fromisoformat(input_data['selectedDate'][:-1])  # Removing 'Z' and converting
        day_of_week = selected_date.weekday()  # Monday is 0, Sunday is 6
        input_array[feature_names.index('day_of_week')] = day_of_week

    if 'startTime' in input_data:
        start_time = datetime.datetime.fromisoformat(input_data['startTime'][:-1])
        start_hour = start_time.hour  
        if 'time' in feature_names:
            input_array[feature_names.index('time')] = start_hour

    if 'endTime' in input_data:
        end_time = datetime.datetime.fromisoformat(input_data['endTime'][:-1])
        end_hour = end_time.hour  
        if 'scheduled_minutes' in feature_names:
            input_array[feature_names.index('scheduled_minutes')] = end_hour

    # Handling 'selectedAirline' to set binary features and related aircraft
    if 'selectedAirline' in input_data:
        selected_airline = input_data['selectedAirline']

        if selected_airline == 'Quantas':
            if 'airline_quantas' in feature_names:
                input_array[feature_names.index('airline_quantas')] = 1
            # Automatically set aircraft features for Quantas
            for feature in feature_names:
                if feature.startswith('aircraft_qf'):
                    input_array[feature_names.index(feature)] = 1

        elif selected_airline == 'Virgin Australia':
            if 'airline_virgin_australia' in [feature.strip() for feature in feature_names]:
                input_array[feature_names.index('airline_virgin_australia')] = 1
            # Automatically set aircraft features for Virgin Australia
            for feature in feature_names:
                if feature.startswith('aircraft_va'):
                    input_array[feature_names.index(feature)] = 1
        elif selected_airline == 'Jetstar':
            # Automatically set aircraft features for Jetstar
            for feature in feature_names:
                if feature.startswith('aircraft_jq'):
                    input_array[feature_names.index(feature)] = 1

    return input_array.reshape(1, -1)




