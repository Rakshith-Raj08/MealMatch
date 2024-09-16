import sys
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import numpy as np
import json
import requests

def main():
    # Retrieve arguments
    if len(sys.argv) != 6:
        print("Usage: python mlModel.py <calories_per_day> <protein_required> <num_meals> <calories_per_meal> <veg_only>")
        sys.exit(1)

    calories_per_day = int(sys.argv[1])
    protein_required = int(sys.argv[2])
    num_meals = int(sys.argv[3])
    calories_per_meal = float(sys.argv[4])
    veg_only = sys.argv[5].lower() in ['true', '1', 't']

    # Spoonacular API request
    api_key = '72e1072e9658440684e983c175659f29'
    url = 'https://api.spoonacular.com/recipes/complexSearch'
    params = {
        'apiKey': api_key,
        'number': num_meals,
        'maxCalories': calories_per_day,
        'minProtein': protein_required,
        'diet': 'vegetarian' if veg_only else 'none'
    }
    try:
        response = requests.get(url, params=params)
        response.raise_for_status()  # Raise an error for bad responses
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        sys.exit(1)

    data = response.json()

    # Convert API data to DataFrame
    recipes = data.get('results', [])
    if not recipes:
        print(json.dumps([]))  # Output an empty JSON array if no data is found
        sys.exit(1)

    # Extract relevant information from API data
    df = pd.DataFrame({
        'id': [recipe['id'] for recipe in recipes],
        'title': [recipe['title'] for recipe in recipes],
        'image': [recipe['image'] for recipe in recipes],
        'calories': [
            recipe.get('nutrition', {}).get('nutrients', [{}])[0].get('amount', np.nan)
            if len(recipe.get('nutrition', {}).get('nutrients', [])) > 0 else np.nan
            for recipe in recipes
        ],
        'protein': [
            recipe.get('nutrition', {}).get('nutrients', [{}])[1].get('amount', np.nan)
            if len(recipe.get('nutrition', {}).get('nutrients', [])) > 1 else np.nan
            for recipe in recipes
        ]
    })

    # Drop rows with missing values
    df['calories'] = pd.to_numeric(df['calories'], errors='coerce')
    df['protein'] = pd.to_numeric(df['protein'], errors='coerce')
    df.dropna(subset=['calories', 'protein'], inplace=True)

    if df.empty:
        print(json.dumps([]))  # Output an empty JSON array if no valid data is found
        sys.exit(1)

    # Prepare the data for ML model
    features = df[['calories', 'protein']]
    target = df['calories']  # Use an appropriate target variable

    # Scale the features
    scaler = StandardScaler()
    features_scaled = scaler.fit_transform(features)

    # Train a simple linear regression model (for demonstration)
    model = LinearRegression()
    model.fit(features_scaled, target)

    # Create prediction data
    new_data = pd.DataFrame([[calories_per_meal, protein_required]], columns=['calories', 'protein'])
    new_data_scaled = scaler.transform(new_data)

    # Make predictions
    predictions = model.predict(new_data_scaled)

    # Format the predictions into JSON
    predictions_json = json.dumps([{"id": i, "predicted_calories": pred} for i, pred in enumerate(predictions)])
    print(predictions_json)

if __name__ == "__main__":
    main()
