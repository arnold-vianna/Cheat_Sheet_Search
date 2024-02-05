from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

def load_cheat_sheet(filename):
    """Loads cheat sheet data from a JSON file."""
    try:
        with open(filename, "r") as f:
            data = json.load(f)
            return data
    except json.JSONDecodeError as e:
        print(f"Error loading {filename}: {e}")
        return {}

def load_cheat_sheets():
    """Loads cheat sheet data from all JSON files in the current directory."""
    cheat_sheets = {}
    for filename in os.listdir():
        if filename.endswith(".json"):
            cheat_sheet_data = load_cheat_sheet(filename)
            cheat_sheets.update(cheat_sheet_data)
    return cheat_sheets

def search_cheat_sheets(query, cheat_sheets):
    """Searches for commands and descriptions matching the query."""
    results = []
    for command, description in cheat_sheets.items():
        if query.lower() in command.lower() or query.lower() in description.lower():
            results.append((command, description))
    return results

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/search', methods=['POST'])
def search():
    query = request.form.get('query')
    cheat_sheets = load_cheat_sheets()
    results = search_cheat_sheets(query, cheat_sheets)
    return jsonify(results)

if __name__ == "__main__":
    app.run(debug=True)