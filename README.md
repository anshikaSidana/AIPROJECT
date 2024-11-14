# Fake Review Detection Web Application

This is a web application that allows users to view, add, and manage products. It integrates an AI model to detect fake reviews for clothing and jewelry products. Users can add products to their cart, write reviews, and get feedback on the authenticity of the reviews they submit. The application is built using Node.js, Express, Passport.js, MongoDB, and integrates an AI model built using Python to detect fake reviews.

## Project Features

- **Product Management**: Add, view, and delete products.
- **User Authentication**: Signup, login, and logout functionalities.
- **Cart Management**: Add products to the cart, update quantities, and view cart.
- **Review System**: Write, view, and delete reviews for products.
- **Fake Review Detection**: The AI model predicts whether reviews are real or fake.
- **Admin Features**: Admin can delete fake reviews and manage products.
- **User-Specific Products**: Users can view products they've added.
- **Flash Messages**: Display success or failure messages based on actions.

## Technologies Used

- **Node.js**: JavaScript runtime for building the backend server.
- **Express**: Web framework for building REST APIs and handling routes.
- **Passport.js**: Authentication middleware for handling user login and sessions.
- **MongoDB**: NoSQL database to store user data, products, reviews, and cart details.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.
- **EJS**: Templating engine for rendering views.
- **Axios**: HTTP client for making requests to the AI model for fake review detection.
- **Python**: Used for the fake review detection model and API (via Flask).
- **Flask**: Web framework for serving the AI model for fake review detection.

## Project Setup

### Prerequisites

- Node.js
- MongoDB (locally or Atlas)
- Python 3.x
- Required Python packages: `flask`, `scikit-learn`, `pandas`, `numpy`, `pickle`, and `nltk`

### Steps to Run the Application

1. **Clone the repository**

    ```bash
    git clone <repository_url>
    cd <repository_folder>
    ```

2. **Install dependencies for Node.js**

    In the root folder of the project:

    ```bash
    npm install
    ```

3. **Install Python dependencies**

    Ensure that you have the necessary Python libraries installed:

    ```bash
    pip install flask scikit-learn pandas numpy pickle nltk
    ```

4. **Configure environment variables**

    Create a `.env` file in the root directory and add the following configurations:

    ```plaintext
    MONGODB_URI=<Your MongoDB URI>
    secret=<Your secret for session encryption>
    ```

5. **Start the Node.js Server**

    Run the Node.js application:

    ```bash
    node app.js
    ```

6. **Start the Flask AI Model API**

    Run the Flask application for the fake review detection:

    ```bash
    python flask_app.py
    ```

    The Flask API will be running on port `5000` and will accept POST requests to `/predict` for fake review detection.

### Folder Structure


### Key Endpoints

- **GET /home**: View all products.
- **GET /product/:id**: View details of a specific product.
- **POST /product/:id/review**: Add a review for a product.
- **POST /addproduct**: Add a new product (requires authentication).
- **GET /cart**: View the user's cart.
- **POST /addtocart/:id**: Add a product to the cart.
- **POST /update-cart/:productId**: Update the quantity of an item in the cart.
- **DELETE /product/:id/review/:reviewid**: Delete a review from a product.
- **POST /product/:id/reviews/delete-fake**: Delete all fake reviews for a product.

### Fake Review Detection

The fake review detection is handled by a Python-based machine learning model. The model is trained using a dataset of product reviews and can predict whether a review is real or fake based on its content. When a review is posted, the content is sent to the Flask API, which returns the prediction.

The model was trained using the `RandomForestClassifier` and uses the `TfidfVectorizer` for text vectorization.

### Database Schema

- **User**: Stores information about registered users.
    - username
    - email
    - password (hashed)
- **Product**: Stores product details.
    - title
    - description
    - price
    - username (owner of the product)
    - review (references to reviews)
- **Review**: Stores reviews for products.
    - content
    - rating
    - author
    - isFake (determined by the AI model)
- **Cart**: Stores items in the user's cart.
    - userId
    - items (array of products with quantity)

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- AI model for fake review detection built using `RandomForestClassifier`.
- MongoDB and Mongoose for database handling.
- Express.js and Passport.js for building the backend API and user authentication.
- Flask for serving the AI model as an API.
