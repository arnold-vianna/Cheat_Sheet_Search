import sqlite3
import logging
import os
from flask import Flask, render_template, request, jsonify
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

app = Flask(__name__)

# SQLite database file
DATABASE = "cheat_sheets.db"

# Helper function to get a database connection
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Allows accessing columns by name
    conn.execute("PRAGMA journal_mode=WAL")  # Enable WAL mode for better concurrency
    return conn

# Helper function to get all themes from the database
@lru_cache(maxsize=1)
def get_themes():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT theme FROM cheat_sheets")
    themes = sorted([row["theme"] for row in cursor.fetchall()])  # Sort themes alphabetically
    conn.close()
    return themes

# Helper function to search cheat sheets
@lru_cache(maxsize=128)
def search_cheat_sheets(theme, command_query, description_query):
    conn = get_db_connection()
    cursor = conn.cursor()
    query = "SELECT theme, command, description FROM cheat_sheets WHERE theme = ?"
    params = [theme]
    if command_query:
        query += " AND LOWER(command) LIKE ?"
        params.append(f"%{command_query}%")
    if description_query:
        query += " AND LOWER(description) LIKE ?"
        params.append(f"%{description_query}%")

    cursor.execute(query, params)
    results = [{"theme": row["theme"], "command": row["command"], "description": row["description"]}
               for row in cursor.fetchall()]
    conn.close()
    return results

@app.route("/")
def index():
    themes = get_themes()
    logging.info("Rendering index page")
    return render_template("index.html", themes=themes)

@app.route("/search", methods=["POST"])
def search():
    data = request.get_json()
    themes = get_themes()
    theme = data.get("theme", themes[0] if themes else None)  # Default to first theme
    if not theme:
        logging.warning("No themes available in the database")
        return jsonify([])

    command_query = data.get("command_query", "").lower()
    description_query = data.get("description_query", "").lower()

    logging.info(f"Searching with theme: {theme}, command_query: {command_query}, description_query: {description_query}")
    results = search_cheat_sheets(theme, command_query, description_query)
    logging.info(f"Found {len(results)} results")
    return jsonify(results)

@app.route("/create_theme", methods=["POST"])
def create_theme():
    data = request.get_json()
    theme_name = data.get("name", "").strip()
    if not theme_name:
        logging.warning("Attempted to create theme with empty name")
        return jsonify({"error": "Theme name cannot be empty"}), 400

    # Check if the theme already exists
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT 1 FROM cheat_sheets WHERE theme = ?", (theme_name,))
    if cursor.fetchone():
        conn.close()
        logging.warning(f"Theme '{theme_name}' already exists")
        return jsonify({"error": "Theme already exists"}), 400

    # Insert a placeholder entry to make the theme appear in the dropdown
    try:
        cursor.execute(
            "INSERT INTO cheat_sheets (theme, command, description) VALUES (?, ?, ?)",
            (theme_name, "placeholder", "This is a placeholder command to initialize the theme")
        )
        conn.commit()
    except sqlite3.Error as e:
        conn.close()
        logging.error(f"Database error while creating theme: {e}")
        return jsonify({"error": str(e)}), 500

    # Clear the themes cache to refresh the dropdown
    get_themes.cache_clear()
    conn.close()
    logging.info(f"Created new theme: {theme_name}")
    return jsonify({"themes": get_themes()})

@app.route("/add_command", methods=["POST"])
def add_command():
    data = request.get_json()
    theme = data.get("theme")
    command = data.get("command", "").strip()
    description = data.get("description", "").strip()

    if not theme or not command or not description:
        logging.warning("Attempted to add command with missing fields")
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # If this is the first real command, remove the placeholder if it exists
        cursor.execute("DELETE FROM cheat_sheets WHERE theme = ? AND command = ? AND description = ?",
                       (theme, "placeholder", "This is a placeholder command to initialize the theme"))
        # Add the new command
        cursor.execute(
            "INSERT OR REPLACE INTO cheat_sheets (theme, command, description) VALUES (?, ?, ?)",
            (theme, command, description)
        )
        conn.commit()
    except sqlite3.Error as e:
        conn.close()
        logging.error(f"Database error while adding command: {e}")
        return jsonify({"error": str(e)}), 500

    # Clear caches
    get_themes.cache_clear()
    search_cheat_sheets.cache_clear()
    conn.close()
    logging.info(f"Added command to theme '{theme}': {command}")
    return jsonify({"message": "Command added successfully"})

@app.route("/delete_command", methods=["POST"])
def delete_command():
    data = request.get_json()
    theme = data.get("theme")
    command = data.get("command")
    description = data.get("description")

    if not theme or not command or not description:
        logging.warning("Attempted to delete command with missing fields")
        return jsonify({"error": "All fields are required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "DELETE FROM cheat_sheets WHERE theme = ? AND command = ? AND description = ?",
            (theme, command, description)
        )
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            logging.warning(f"No command found to delete: {theme}, {command}")
            return jsonify({"error": "Command not found"}), 404
    except sqlite3.Error as e:
        conn.close()
        logging.error(f"Database error while deleting command: {e}")
        return jsonify({"error": str(e)}), 500

    # Clear caches
    get_themes.cache_clear()
    search_cheat_sheets.cache_clear()
    conn.close()
    logging.info(f"Deleted command from theme '{theme}': {command}")
    return jsonify({"message": "Command deleted successfully"})

@app.route("/delete_theme", methods=["POST"])
def delete_theme():
    data = request.get_json()
    theme = data.get("theme")

    if not theme:
        logging.warning("Attempted to delete theme with empty name")
        return jsonify({"error": "Theme name cannot be empty"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM cheat_sheets WHERE theme = ?", (theme,))
        conn.commit()
        if cursor.rowcount == 0:
            conn.close()
            logging.warning(f"No theme found to delete: {theme}")
            return jsonify({"error": "Theme not found"}), 404
    except sqlite3.Error as e:
        conn.close()
        logging.error(f"Database error while deleting theme: {e}")
        return jsonify({"error": str(e)}), 500

    # Clear caches
    get_themes.cache_clear()
    search_cheat_sheets.cache_clear()
    conn.close()
    logging.info(f"Deleted theme: {theme}")
    return jsonify({"themes": get_themes()})

if __name__ == "__main__":
    # In a Docker container, we always run with Gunicorn, so no need for FLASK_ENV check
    logging.info("Starting Flask app with Gunicorn")
    # Gunicorn will be started via the Dockerfile CMD