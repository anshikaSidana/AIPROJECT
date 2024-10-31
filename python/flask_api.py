from flask import Flask, request, jsonify
import pickle

# Load the model and vectorizer
with open('C:\\Users\\anakv\\aipro\\website\\python\\review_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

with open('C:\\Users\\anakv\\aipro\\website\\python\\vectorizer.pkl', 'rb') as vec_file:
    vectorizer = pickle.load(vec_file)

app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    content = request.json.get('content', '')  # Default to empty string if 'content' is not provided
    if not content:
        return jsonify({'error': 'No content provided'}), 400  # Return an error if no content is provided
    
    try:
        X = vectorizer.transform([content])
        prediction = model.predict(X)
        print(prediction[0])
        return jsonify({'isFake': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error details

if __name__ == '__main__':
    app.run(debug=True, port=5000)
