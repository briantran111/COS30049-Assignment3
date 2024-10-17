from pydantic import BaseModel

class PredictionRequest(BaseModel):
    """
    Schema for the input data sent to the API for making predictions.
    This assumes that input_data is a list of numerical features.
    """
    input_data: list  # List of numerical values as input to the models
