import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
from datetime import datetime

# Load the data
df = pd.read_csv('../data/delay_dataset.csv')

# Convert time columns to datetime
df['Scheduled Time'] = pd.to_datetime(df['Scheduled Time'], format='%I:%M %p', errors='coerce')
df['Actual Time'] = pd.to_datetime(df['Actual Time'], format='%I:%M %p', errors='coerce')

# Calculate the delay in minutes, handling missing values
df['Delay (Minutes)'] = (df['Actual Time'] - df['Scheduled Time']).dt.total_seconds() / 60
df['Delay (Minutes)'] = df['Delay (Minutes)'].fillna(0)  # Replace NaNs with 0 for flights with missing times

# Create a binary column 'Delayed' (1 = delayed by 15 minutes or more, 0 = not delayed)
df['Delayed'] = (df['Delay (Minutes)'] >= 15).astype(int)

# Feature Engineering: Extract day of the week
df['Day of Week'] = pd.to_datetime(df['Day'], format='%d %b %Y', errors='coerce').dt.dayofweek

# Create time bins (Morning, Afternoon, Evening)
def bin_time(time):
    if pd.isna(time):
        return 'Unknown'
    hour = time.hour
    if 4 <= hour < 12:
        return 'Morning'
    elif 12 <= hour < 18:
        return 'Afternoon'
    else:
        return 'Evening'

df['Time Period'] = df['Scheduled Time'].apply(bin_time)

# Handle missing values in categorical columns
df['Aircraft'] = df['Aircraft'].fillna('Unknown')
df['Time Period'] = df['Time Period'].fillna('Unknown')

# Define features and target variable for classification
# Consider adding more features such as 'Day of Week', 'Time Period'
X = df[['Aircraft', 'Day of Week', 'Time Period']]  # Include more features
y = df['Delayed']  # Target variable

# Handle categorical variables (e.g., 'Aircraft') via one-hot encoding
X = pd.get_dummies(X, drop_first=True)

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the Random Forest Classifier
rf_model = RandomForestClassifier(random_state=42)
rf_model.fit(X_train, y_train)

# Make predictions
y_pred = rf_model.predict(X_test)

# Evaluate the classifier
accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)
print(classification_report(y_test, y_pred))

# Assuming 'rf_model' is already trained
with open('../ml_models/random_forest_model.pkl', 'wb') as file:
    pickle.dump(rf_model, file)
