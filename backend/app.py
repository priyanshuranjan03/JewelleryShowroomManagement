from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
import numpy as np

app = Flask(__name__)
CORS(app)
# Example: Train the model with random data (Replace this with your actual data)
# Assume you have a CSV file named 'training_data.csv' with columns: loyalty_points, discount_percent
# Load your data using pandas: df = pd.read_csv('training_data.csv')
# X_train = df[['loyalty_points', 'discount_percent']]
# y_train = df['predicted_discount']
# model.fit(X_train, y_train)

# For simplicity, using random data for demonstration
np.random.seed(42)
X_train = np.random.rand(100, 2) * 100  # 100 samples, 2 features
y_train = X_train[:, 0] * 0.5 + X_train[:, 1] * 0.2  # Linear relationship

model = LinearRegression()
model.fit(X_train, y_train)

@app.route('/predict_discount', methods=['POST'])
def predict_discount():
    data = request.get_json()
    print(data)
    loyalty_points = data['loyaltyPoints']
    discount_percent = data['discountPercent']
    print(loyalty_points," ",discount_percent)
    # Use the trained model to predict the discount
    predicted_discount = model.predict([[loyalty_points, discount_percent]])
    print(predicted_discount)
    return jsonify({'predicted_discount': predicted_discount[0]})

if __name__ == '__main__':
    app.run(debug=True)
