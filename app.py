import pandas as pd
import re
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import pickle
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import nltk

nltk.download('punkt', quiet=True)
nltk.download('stopwords', quiet=True)


df = pd.read_csv('C:\\Users\\anakv\\aipro\\website\\python\\dataset\\reviews.csv')  # Adjust path if necessary

df_filtered = df[df['category'] == 'Clothing_Shoes_and_Jewelry_5']


df_filtered = df_filtered[['text_', 'label']]


df_filtered['label'] = df_filtered['label'].map({'CG': 0, 'OR': 1})


def preprocess_text(text):
    if not text:
        return ''
    text = text.lower()
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    tokens = [word for word in tokens if word not in stop_words]
    return ' '.join(tokens)

df_filtered['text_'] = df_filtered['text_'].apply(preprocess_text)


vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(df_filtered['text_'])

Y = df_filtered['label']


X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=42)


model = RandomForestClassifier()
model.fit(X_train, y_train)

accuracy = accuracy_score(y_test, model.predict(X_test))
print(f"Accuracy: {accuracy * 100:.2f}%")


with open('C:\\Users\\anakv\\aipro\\website\\python\\review_model.pkl', 'wb') as model_file:
    pickle.dump(model, model_file)

with open('C:\\Users\\anakv\\aipro\\website\\python\\vectorizer.pkl', 'wb') as vec_file:
    pickle.dump(vectorizer, vec_file)

print("Model and vectorizer saved successfully!")
