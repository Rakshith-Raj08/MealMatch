import sys
import pandas as pd
import numpy as np
import json
import requests
from itertools import combinations
from dotenv import load_dotenv
import os

def fetch_recipes(api_key, calories_per_day, protein_required, veg_only):
    url = 'https://api.spoonacular.com/recipes/complexSearch'
    params = {
        'apiKey': api_key,
        'number': 60,  # Fetch more than needed to ensure we have enough unique recipes
        'maxCalories': calories_per_day,
        'minProtein': protein_required,
        'diet': 'vegetarian' if veg_only else 'none',
        'addRecipeInformation': True,
        'fillIngredients': True
    }

    response = requests.get(url, params=params)
    response.raise_for_status()
    return response.json()

def main():
    if len(sys.argv) != 6:
        print("Usage: python mlModel.py <calories_per_day> <protein_required> <num_meals> <calories_per_meal> <veg_only>")
        sys.exit(1)

    calories_per_day = int(sys.argv[1])
    protein_required = int(sys.argv[2])
    num_meals = int(sys.argv[3])
    calories_per_meal = float(sys.argv[4])
    veg_only = sys.argv[5].lower() in ['true', '1', 't']

    # Load environment variables
    load_dotenv()
    api_key = os.getenv('SPOONACULAR_API_KEY')

    if not api_key:
        print("API key not found in environment variables.")
        sys.exit(1)

    data = fetch_recipes(api_key, calories_per_day, protein_required, veg_only)
    recipes = data.get('results', [])

    if not recipes:
        print("No recipes found from API.")
        sys.exit(1)

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

    df['calories'] = pd.to_numeric(df['calories'], errors='coerce')
    df['protein'] = pd.to_numeric(df['protein'], errors='coerce')
    df.dropna(subset=['calories', 'protein'], inplace=True)

    if df.empty:
        print("No valid recipes with calorie and protein information.")
        sys.exit(1)

    recommendations = []
    used_indices = set()

    for day in range(1, 8):  # 7 days of recommendations
        valid_combinations = []
        for combo in combinations(df.index, num_meals):
            if any(index in used_indices for index in combo):
                continue  # Skip if any recipe is already used

            selected_meals = df.loc[list(combo)]
            total_calories = selected_meals['calories'].sum()
            total_protein = selected_meals['protein'].sum()

            calorie_diff = abs(total_calories - calories_per_day)
            protein_diff = abs(total_protein - protein_required)
            score = calorie_diff + protein_diff

            valid_combinations.append((score, selected_meals))

        if not valid_combinations:
            # If not enough unique recipes, reuse previously used ones
            print(f"Not enough unique recipes for day {day}, reusing recipes from previous days.")
            for combo in combinations(df.index, num_meals):
                selected_meals = df.loc[list(combo)]
                total_calories = selected_meals['calories'].sum()
                total_protein = selected_meals['protein'].sum()

                calorie_diff = abs(total_calories - calories_per_day)
                protein_diff = abs(total_protein - protein_required)
                score = calorie_diff + protein_diff

                valid_combinations.append((score, selected_meals))

        valid_combinations.sort(key=lambda x: x[0])
        best_combo = valid_combinations[0]
        best_meals = best_combo[1]

        recommendations.append({
            "day": day,
            "meals": best_meals.to_dict(orient='records')
        })

        # Update used_indices even if reusing recipes
        used_indices.update(best_meals.index)

    print(json.dumps(recommendations, indent=2))

if __name__ == "__main__":
    main()
