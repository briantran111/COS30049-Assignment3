import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score

# Load the dataset
flight_data = pd.read_csv('../data/processed_flight_data.csv')

# Convert 'Day' to datetime and extract day of the week
flight_data['Day'] = pd.to_datetime(flight_data['Day'], format="%d %b %Y")
flight_data['Day of Week'] = flight_data['Day'].dt.dayofweek  # Monday=0, Sunday=6

# Function to convert time to minutes
def convert_to_minutes(time_str):
    if isinstance(time_str, str):
        time, period = time_str.split()
        hour, minute = map(int, time.split(":"))
        if period == "PM" and hour != 12:
            hour += 12
        elif period == "AM" and hour == 12:
            hour = 0
        return hour * 60 + minute
    return None

# Apply the conversion function
flight_data['Scheduled Minutes'] = flight_data['Scheduled Time'].apply(convert_to_minutes)

# Binning Time into Morning, Afternoon, Evening
def bin_time(minutes):
    if 240 <= minutes < 720:  # 4:00 AM - 11:59 AM
        return 'Morning'
    elif 720 <= minutes < 1080:  # 12:00 PM - 5:59 PM
        return 'Afternoon'
    else:  # 6:00 PM - 3:59 AM (next day)
        return 'Evening'

# Create a new 'Time Period' feature
flight_data['Time Period'] = flight_data['Scheduled Minutes'].apply(bin_time)

# One-hot encode 'Airline', 'Aircraft', and the new 'Time Period' feature
flight_data_encoded = pd.get_dummies(flight_data, columns=['Airline', 'Aircraft', 'Time Period'], drop_first=True)

# Define features (X) and target (y)
X = flight_data_encoded.drop(columns=['Price ( AUD )', 'Day', 'Scheduled Time', 'Actual Time'])
y = flight_data_encoded['Price ( AUD )']

# Split data into training and testing sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create polynomial features (degree=2)
poly = PolynomialFeatures(degree=2, include_bias=False)
X_train_poly = poly.fit_transform(X_train)
X_test_poly = poly.transform(X_test)

# Train a linear regression model using the polynomial features
poly_model = LinearRegression()
poly_model.fit(X_train_poly, y_train)

# Predict on the test set
y_pred_poly = poly_model.predict(X_test_poly)

# Evaluate the polynomial model
mse_poly = mean_squared_error(y_test, y_pred_poly)
r2_poly = r2_score(y_test, y_pred_poly)

# Print the evaluation metrics
print(f"Mean Squared Error (Polynomial Model): {mse_poly:.2f}")
print(f"R-squared (Polynomial Model): {r2_poly:.2f}")

with open('../ml_models/linear_regression_model.pkl', 'wb') as file:
    pickle.dump(poly_model, file)