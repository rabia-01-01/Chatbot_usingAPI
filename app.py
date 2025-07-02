from dotenv import load_dotenv
from flask import Flask, render_template, request, jsonify
import os
import google.generativeai as genai

app = Flask(__name__)

# Replace with your actual Gemini API key
load_dotenv()  # Load environment variables from .env file
key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=key)
model = genai.GenerativeModel('gemini-1.5-flash')
# print(model)

# response =  model.generate_content(["how are you"])
# print(response.text)

SYSTEM_PROMPT = """You are a digital literacy assistant helping users learn to use:
- WhatsApp (messaging, calls, status)
- Paytm (payments, wallet, UPI)
- Google Maps (navigation, search, directions)
- Other common digital tools
- If the user asks about a topic not listed, politely inform them that you can only assist with the mentioned tools.
Your responses should be:
- Sorry! I can't help you with this, I can only assist with WhatsApp, Paytm, Google Maps, and other common digital tools.
Provide clear, step-by-step instructions in simple language. Use numbered lists and emojis when helpful. If unsure, ask for clarification."""

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask():
    data = request.json
    # print(data)
    user_question = data.get("question", "")
    print(user_question)
    try:
        response =  model.generate_content(
            f"{SYSTEM_PROMPT}\n\nUser Question: {user_question}"
        )
        print(response)
        return jsonify({"answer": response.text})
    except Exception as e:
        return jsonify({"answer": "Sorry, something went wrong. Please try again."})

if __name__ == "__main__":
    app.run(debug=True)

