from fastapi import FastAPI, HTTPException, Request
from backend.app.schemas import PricePredictionRequest, DelayPredictionRequest, PricePredictionResponse, DelayPredictionResponse
from backend.app.models import load_all_models
from backend.app.utils import prepare_input, preprocess_input
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],    
)

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

@app.post("/api/findFlights")
async def find_flights(request: Request):
    data = await request.json()
    print("Raw input data from request:", data)
    print("Feature names:", feature_names)


    try:
        # Prepare the input data
        input_data = prepare_input(data, feature_names)
        print("Prepared input data for model (before scaling):", input_data)

        # Transform the input data
        input_poly = preprocess_input(input_data, scaler, poly)
        print("Transformed input data for model (after scaling and transformation):", input_poly)

        # Make predictions
        predicted_price = max(0, ridge_model.predict(input_poly)[0])
        print("Predicted price:", predicted_price)

        # Delay prediction
        delay_data = prepare_input(data, delay_feature_names)
        delay_prediction = rf_model.predict(delay_data)[0]
        delay_label = "Delayed" if delay_prediction == 1 else "On time"
        print("Delay prediction:", delay_label)

        return {
            "message": "Flights found successfully!",
            "predicted_price": predicted_price,
            "delay_prediction": delay_label,
            "input_data": {
                "selectedDate": data.get("selectedDate"),
                "start_time": data.get("startTime"),
                "end_time": data.get("endTime"),
                "selected_airline": data.get("selectedAirline"),
            },
        }

    except Exception as e:
        print(f"Error in flight search: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error in flight search: {str(e)}")

@app.get("/")
async def root():
    return {"message": "Welcome to the Flight Prediction API!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
