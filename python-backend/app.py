from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore
import uuid

# Load Firebase credentials (download from Firebase console)
cred = credentials.Certificate("../public/firebase-adminsdk.json")
firebase_admin.initialize_app(cred)

# Initialize Firestore DB
db = firestore.client()

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get('message')
    session_id = data.get('session_id')
    
    if not session_id:
        session_id = str(uuid.uuid4())
        # Create a new session with empty messages list
        db.collection('sessions').document(session_id).set({
            'session_id': session_id,
            'messages': []
        })

    # Fetch the current session
    session_ref = db.collection('sessions').document(session_id)
    session = session_ref.get().to_dict()

    # Call OpenAI API
    completion = client.chat.completions.create(
        model="gpt-4o",  # Replace with the correct model name
        messages=[{"role": "user", "content": user_message}]
    )
    response_message = completion.choices[0].message.content

    # Update the session with new messages
    session_ref.update({
        'messages': firestore.ArrayUnion([{
            'user_message': user_message,
            'response_message': response_message
        }])
    })
    
    return jsonify({"response": response_message, "session_id": session_id})


@app.route('/load-chat/<session_id>', methods=['GET'])
def load_chat(session_id):
    print(session_id)
    session_ref = db.collection('sessions').document(session_id)
    print(session_ref)
    session = session_ref.get().to_dict()
    print(session)

    if session and 'messages' in session:
        messages = session['messages']
    else:
        messages = []

    return jsonify({"messages": messages})


@app.route('/get-sessions', methods=['GET'])
def get_sessions():
    sessions = db.collection('sessions').stream()
    session_ids = [session.id for session in sessions]
    return jsonify({"sessions": session_ids})

if __name__ == '__main__':
    app.run(debug=True)
