#######################################################
# Author: Arnold Vianna
# https://github.com/arnold-vianna
# https://arnold-vianna.github.io/
#######################################################

import json
import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__)

# Function to load JSON data from a file
def load_json_data(filename):
    if os.path.exists(filename):
        with open(filename, 'r') as f:
            return json.load(f)
    else:
        # Handle the case where the file doesn't exist
        return jsonify({"error": "File not found"})

# Endpoint to get all JSON filenames
@app.route('/get_json_files')
def get_json_files():
    json_files = [f for f in os.listdir('.') if f.endswith('.json')]
    return jsonify(json_files)

# Endpoint to get JSON data for a specific file or all data if no filename is specified
@app.route('/get_json_data', methods=['POST'])
def get_json_data():
    filename = request.json.get('filename')
    if filename:
        return jsonify(load_json_data(filename))
    else:
        # If no filename is provided, return all JSON data
        data = {}
        for file in os.listdir('.'):
            if file.endswith('.json'):
                data.update(load_json_data(file))
        return jsonify(data)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    # Run the Flask app on host '0.0.0.0' (all network interfaces) and port 9898
    app.run(host="127.0.0.1", port=9123, debug=True)
