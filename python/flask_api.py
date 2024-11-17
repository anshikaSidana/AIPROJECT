from flask import Flask, request, jsonify
import pickle
import time
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(BASE_DIR, 'review_model.pkl'), 'rb') as model_file:
    model = pickle.load(model_file)

with open(os.path.join(BASE_DIR, 'vectorizer.pkl'), 'rb') as vec_file:
    vectorizer = pickle.load(vec_file)


app = Flask(__name__)
ip_tracking = {}


@app.route('/predict', methods=['POST'])
def predict():
    content = request.json.get('content', '')  
    if not content:
        return jsonify({'error': 'No content provided'}), 400  

    client_ip = request.remote_addr  # Get client's IP address
    current_time = time.time()

    if client_ip in ip_tracking:
        last_time = ip_tracking[client_ip]
        if current_time - last_time < 60:  # 60-second threshold
            return jsonify({'isFake': 1, 'reason': 'Reviews from the same IP in quick succession are considered fake'})

    # Update IP tracking
    ip_tracking[client_ip] = current_time

    try:
        X = vectorizer.transform([content])
        prediction = model.predict(X)
        print(prediction[0])
        if(prediction[0] == 0):
            return jsonify({'isFake': 1})
        else:
            return jsonify({'isFake': 0})
        
        return jsonify({'isFake': int(prediction[0])})
    except Exception as e:
        return jsonify({'error': str(e)}), 500  # Return error details

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)


