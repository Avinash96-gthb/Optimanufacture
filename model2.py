from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import yfinance as yf
import datetime
from statsmodels.tsa.arima.model import ARIMA
import requests

# Initialize FastAPI app
app = FastAPI()

# Constants
LM_STUDIO_API_URL = "http://127.0.0.1:1233/v1/chat/completions"  # Local URL for LM Studio API

# Request model for chatbot input
class ChatRequest(BaseModel):
    prompt: str
    start_date: str
    end_date: str
    prediction_start_date: str
    prediction_end_date: str

# Function to fetch steel prices
def fetch_steel_prices(start_date, end_date, conversion_rate):
    ticker = 'SLX'  
    data = yf.download(ticker, start=start_date, end=end_date)
    if data.empty:
        return None
    data['Close (INR)'] = data['Close'] * conversion_rate
    output_data = data[['Close', 'Close (INR)', 'Volume']].copy()
    output_data.reset_index(inplace=True)
    output_data.set_index('Date', inplace=True)
    output_data = output_data.asfreq('B')  # Business day frequency
    return output_data

# Function to predict steel prices using ARIMA model
def predict_price_with_arima(data, num_periods, frequency, conversion_rate, prediction_start_date):
    model_data = data['Close']
    model = ARIMA(model_data, order=(5, 1, 0))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=num_periods)
    predictions = []
    last_price = model_data.iloc[-1]

    for i, price in enumerate(forecast):
        if frequency == 'daily':
            date = prediction_start_date + pd.DateOffset(days=i)
        price_inr = price * conversion_rate
        percentage_change = ((price - last_price) / last_price) * 100
        movement = "UP" if price > last_price else "DOWN"
        message = (f"{date.strftime('%d/%m/%Y')}: Predicted steel price will go {movement} "
                   f"by {abs(percentage_change):.2f}%")
        predictions.append(message)
        last_price = price
    return "\n".join(predictions)

# Function to get LLM insight using LM Studio API
def get_llm_insight(predictions):
    payload = {
        "model": "mistral-7b-instruct-v0.2",
        "messages": [
            {"role": "user", "content": "Please provide a descriptive output paragraph of the steel prices predicted by the ARIMA model."},
            {"role": "assistant", "content": f"Assume you are an expert in steel price insights. Provide a descriptive output paragraph based on these predictions:\n{predictions}"}
        ],
        "temperature": 0.7,
        "max_tokens": 512
    }
    try:
        response = requests.post(LM_STUDIO_API_URL, json=payload)
        response.raise_for_status()
        result = response.json()
        return result['choices'][0]['message']['content']
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error contacting LLM API: {str(e)}")

# FastAPI endpoint to interact with chatbot
@app.post("/chatbot/")
async def chatbot(request: ChatRequest):
    try:
        # Parse date inputs
        start_date = datetime.datetime.strptime(request.start_date, '%d-%m-%Y')
        end_date = datetime.datetime.strptime(request.end_date, '%d-%m-%Y')
        prediction_start_date = datetime.datetime.strptime(request.prediction_start_date, '%d-%m-%Y')
        prediction_end_date = datetime.datetime.strptime(request.prediction_end_date, '%d-%m-%Y')
        conversion_rate = 83.0  # Conversion rate as INR

        # Fetch steel prices
        data = fetch_steel_prices(start_date, end_date, conversion_rate)
        if data is None:
            raise HTTPException(status_code=404, detail="No steel price data found for the specified date range.")

        # Calculate number of periods for ARIMA model
        num_periods = (prediction_end_date - prediction_start_date).days + 1
        if num_periods < 1:
            raise HTTPException(status_code=400, detail="The end date must be after the start date.")

        # Get ARIMA predictions
        predictions = predict_price_with_arima(data, num_periods, 'daily', conversion_rate, prediction_start_date)

        # Send predictions to LLM and get insight
        llm_output = get_llm_insight(predictions)

        # Return response
        return {"llm_output": llm_output, "arima_predictions": predictions}

    except ValueError as ve:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {ve}")

# Example of how to run: Use `uvicorn filename:app --reload` to start the FastAPI app
