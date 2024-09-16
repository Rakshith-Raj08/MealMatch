import sys
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
from sqlalchemy import create_engine
import numpy as np

# Retrieve arguments
if len(sys.argv) != 6:
    print("Usage: python mlModel.py <calories_per_day> <protein_required> <num_meals> <calories_per_meal> <veg_only>")
    sys.exit(1)

calories_per_day = int(sys.argv[1])
protein_required = int(sys.argv[2])
num_meals = int(sys.argv[3])
calories_per_meal = float(sys.argv[4])
veg_only = sys.argv[5].lower() in ['true', '1', 't']

# Database connection
DATABASE_URL = "postgresql+psycopg2://rakshith-raj:Pip432po0@localhost/meal-match"
engine = create_engine(DATABASE_URL)

# Query the database
query = """
SELECT id, calories, protein, servings 
FROM meals 
WHERE (veg_only = %s OR %s IS NULL)
"""
df = pd.read_sql_query(query, engine, params=(veg_only, None))

if df.empty:
    print("No data found for the given criteria.")
    sys.exit(1)

# Prepare the data for ML model
features = df[['calories', 'protein']].copy()

# Scale the features
scaler = StandardScaler()
features_scaled = scaler.fit_transform(features)

# Train a simple linear regression model (for demonstration)
X_train = features_scaled
y_train = df['calories']  # Placeholder target variable

model = LinearRegression()
model.fit(X_train, y_train)

# Create prediction data
new_data = pd.DataFrame([[calories_per_meal, protein_required]], columns=['calories', 'protein'])
new_data_scaled = scaler.transform(new_data)
predictions = model.predict(new_data_scaled)

# Print predictions (for demonstration purposes)
print("Predicted values:", predictions)
