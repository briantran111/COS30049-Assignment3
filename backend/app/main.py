from fastapi import FastAPI, HTTPException
from .schemas import PredictionRequest
from .models import predict_price, predict_delay
from .utils import preprocess, postprocess

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Welcome to the Flight Prediction API!"}

@app.post("/predict_price/")
async def predict_flight_price(request: PredictionRequest):
    try:
        # Preprocess the input data for price prediction
        model_input = preprocess(request.input_data, "price")
        prediction = predict_price(model_input)
        # Postprocess the result to return it in a user-friendly format
        result = postprocess(prediction, "price")
        return {"price_prediction": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/predict_delay/")
async def predict_flight_delay(request: PredictionRequest):
    try:
        # Preprocess the input data for delay prediction
        model_input = preprocess(request.input_data, "delay")
        prediction = predict_delay(model_input)
        result = postprocess(prediction, "delay")
        return {"delay_prediction": result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    print("Starting FastAPI server...")
    uvicorn.run(app, host="0.0.0.0", port=8000)
