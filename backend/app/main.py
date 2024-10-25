from fastapi import FastAPI, HTTPException
from schemas import PricePredictionRequest, DelayPredictionRequest, PricePredictionResponse, DelayPredictionResponse
from models import load_all_models
from utils import prepare_input, preprocess_input

app = FastAPI()

# Load models at startup
ridge_model, scaler, poly, rf_model = load_all_models()
delay_feature_names = [
    'day_of_week', 
    'aircraft_jq502', 'aircraft_jq504', 'aircraft_jq508', 'aircraft_jq512', 'aircraft_jq518',
    'aircraft_jq520', 'aircraft_jq522', 'aircraft_jq524', 'aircraft_jq528', 'aircraft_jq530', 
    'aircraft_jq532', 'aircraft_qf402', 'aircraft_qf406', 'aircraft_qf410', 'aircraft_qf414',
    'aircraft_qf418', 'aircraft_qf422', 'aircraft_qf426', 'aircraft_qf430', 'aircraft_qf432',
    'aircraft_qf436', 'aircraft_qf440', 'aircraft_qf444', 'aircraft_qf448', 'aircraft_qf454',
    'aircraft_qf462', 'aircraft_qf464', 'aircraft_qf466', 'aircraft_qf470', 'aircraft_qf472',
    'aircraft_qf478', 'aircraft_qf498', 'aircraft_va803', 'aircraft_va811', 'aircraft_va815',
    'aircraft_va819', 'aircraft_va823', 'aircraft_va827', 'aircraft_va833', 'aircraft_va841',
    'aircraft_va849', 'aircraft_va853', 'aircraft_va859', 'aircraft_va863', 'aircraft_va867',
    'aircraft_va869', 'aircraft_va871', 'aircraft_va875', 'aircraft_va879', 'aircraft_va883',
    'time_period_evening', 'time_period_morning'
]
feature_names = [
    'time', 'day_of_week', 'scheduled_minutes', 
    'airline_quantas', 'airline_virgin_australia',
    'aircraft_jq502', 'aircraft_jq504', 'aircraft_jq508', 'aircraft_jq512', 
    'aircraft_jq518', 'aircraft_jq520', 'aircraft_jq522', 'aircraft_jq524', 
    'aircraft_jq528', 'aircraft_jq530', 'aircraft_jq532', 'aircraft_qf402', 
    'aircraft_qf406', 'aircraft_qf410', 'aircraft_qf414', 'aircraft_qf418', 
    'aircraft_qf422', 'aircraft_qf426', 'aircraft_qf430', 'aircraft_qf432', 
    'aircraft_qf436', 'aircraft_qf440', 'aircraft_qf444', 'aircraft_qf448', 
    'aircraft_qf454', 'aircraft_qf462', 'aircraft_qf464', 'aircraft_qf466', 
    'aircraft_qf470', 'aircraft_qf472', 'aircraft_qf478', 'aircraft_qf498', 
    'aircraft_va803', 'aircraft_va811', 'aircraft_va815', 'aircraft_va819', 
    'aircraft_va823', 'aircraft_va827', 'aircraft_va833', 'aircraft_va841', 
    'aircraft_va849', 'aircraft_va853', 'aircraft_va859', 'aircraft_va863', 
    'aircraft_va867', 'aircraft_va869', 'aircraft_va871', 'aircraft_va875', 
    'aircraft_va879', 'aircraft_va883', 'time_period_evening', 'time_period_morning'
]

print(f"Number of expected features: {len(feature_names)}")
@app.get("/")
async def root():
    return {"message": "Welcome to the Flight Prediction API!"}

@app.post("/predict_price/", response_model=PricePredictionResponse)
async def predict_flight_price(request: PricePredictionRequest):
    try:
        # Convert request data to numpy array
        input_data = prepare_input(request.dict(), feature_names)
        print(f"Input shape before scaling: {input_data.shape}")
        # Apply scaling and polynomial transformation
        input_poly = preprocess_input(input_data, scaler, poly)
        print(f"Input shape after polynomial transformation: {input_poly.shape}")
        # Make price prediction
        predicted_price = ridge_model.predict(input_poly)[0]
        return {"predicted_price": predicted_price}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in price prediction: {str(e)}")

@app.post("/predict_delay/", response_model=DelayPredictionResponse)
async def predict_flight_delay(request: DelayPredictionRequest):
    try:
        # Convert request data to numpy array
        input_data = prepare_input(request.dict(), delay_feature_names)

        # Scale input for delay prediction (no polynomial transformation)
        input_scaled = input_data

        # Make delay prediction
        delay_prediction = rf_model.predict(input_scaled)[0]
        delay_label = "Delayed" if delay_prediction == 1 else "On time"
        return {"delay_prediction": delay_label}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in delay prediction: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
