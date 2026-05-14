from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

@app.route('/')
def home():
    return "Flask server is running!"

# A simple in-memory store for messages
messages = []

@app.route('/api/messages', methods=['GET', 'POST'])
def handle_messages():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'name' not in data or 'email' not in data or 'message' not in data:
            return jsonify({"error": "Missing data"}), 400
        
        new_message = {
            "name": data['name'],
            "email": data['email'],
            "message": data['message']
        }
        messages.append(new_message)
        return jsonify(new_message), 201

    elif request.method == 'GET':
        return jsonify(messages)


if __name__ == '__main__':
    app.run(debug=True)
