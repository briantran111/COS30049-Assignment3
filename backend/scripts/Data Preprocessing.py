import pandas as pd

# Load your datasets
df_price = pd.read_csv('../data/price_dataset.csv')
df_delay = pd.read_csv('../data/delay_dataset.csv')

# Print the columns to check if 'Time' exists
print("Price Dataset Columns:", df_price.columns.tolist())
print("Delay Dataset Columns:", df_delay.columns.tolist())

# Standardize column values for merging
for col in ['Airline', 'Aircraft', 'Day']:
    df_price[col] = df_price[col].str.strip().str.lower()
    df_delay[col] = df_delay[col].str.strip().str.lower()

# Perform the merge using only available common columns
df_merged = pd.merge(df_price, df_delay, on=['Airline', 'Aircraft', 'Day'], how='outer')

# Check the merged DataFrame
print("Merged DataFrame Shape:", df_merged.shape)
print("Merged DataFrame Preview:\n", df_merged)

# Convert 'Time' column to 24-hour format and numeric
def convert_to_24_hour(time_str):
    try:
        return pd.to_datetime(time_str, format='%I:%M %p').hour  # Convert to hour
    except ValueError:
        return None  # Return None for invalid formats

# Apply conversion to 'Time' column in the merged DataFrame
df_merged['Time'] = df_merged['Time'].apply(convert_to_24_hour)

# Handle missing values by filling with median for numeric columns
df_merged['Price ( AUD )'].fillna(df_merged['Price ( AUD )'].median(), inplace=True)
df_merged['Time'].fillna(df_merged['Time'].median(), inplace=True)  # Fill missing Time with median

# Fill missing values for 'Scheduled Time' and 'Actual Time'
df_merged['Actual Time'].fillna(method='ffill', inplace=True)
df_merged['Scheduled Time'].fillna(method='ffill', inplace=True)


# Check if there are any missing values in 'Time' and 'Price ( AUD )'
print("Missing 'Time':", df_merged['Time'].isnull().sum())
print("Missing 'Price ( AUD )':", df_merged['Price ( AUD )'].isnull().sum())
print("Missing 'Scheduled Time':", df_merged['Scheduled Time'].isnull().sum())
print("Missing 'Actual Time':", df_merged['Actual Time'].isnull().sum())

# Save the merged DataFrame if it's not empty
if not df_merged.empty:
    df_merged.to_csv('processed_flight_data.csv', index=False)
    print("Merged data saved.")
else:
    print("No matching data found. Merged file not saved.")
