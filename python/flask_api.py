from flask import Flask, request, jsonify
import pickle
from textblob import TextBlob
import re
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import nltk
from flask_cors import CORS
import time

nltk.download('stopwords')

app = Flask(__name__)
CORS(app)

model = pickle.load(open("reviewModel.pkl", "rb"))
vectorizer = pickle.load(open("reviewVecotorizer.pkl", "rb"))

sw = set(stopwords.words("english"))
stemmer = PorterStemmer()

# Track recent review times per IP or source
review_timestamps = {}

def preprocess(text):
    txt = TextBlob(text)
    result = txt.correct()
    removed_special = re.sub("[^a-zA-Z]", " ", str(result))
    tokens = removed_special.lower().split()
    cleaned = [t for t in tokens if t not in sw]
    stemmed = [stemmer.stem(t) for t in cleaned]
    return " ".join(stemmed), len(tokens)

@app.route("/predict_review", methods=["POST"])
def predict_review():
    data = request.get_json()
    print("Received data:", data)

    if not data or "text" not in data:
        return jsonify({ "error": "No text provided" }), 400

    review_text = data["text"]
    source = request.remote_addr  # IP address of the client
    current_time = time.time()

    # Check if the same source has sent a review in the last 30 seconds
    if source in review_timestamps:
        last_time = review_timestamps[source]
        if current_time - last_time < 30:
            print("Detected multiple reviews in 30 sec from same IP:", source)
            return jsonify({ "prediction": "FAKE", "reason": "Multiple reviews within 30 seconds from same address" })

    # Update latest time for this source
    review_timestamps[source] = current_time

    cleaned, word_count = preprocess(review_text)

    # Basic rule: if more than 30 words, mark as fake
    if word_count > 30:
        prediction_label = "FAKE"
    else:
        vectorized = vectorizer.transform([cleaned])
        prediction = model.predict(vectorized)
        prediction_label = "FAKE" if prediction[0] == 0 else "REAL"

    print("Prediction:", prediction_label)
    return jsonify({ "prediction": prediction_label })

if __name__ == "__main__":
    app.run(debug=True)
