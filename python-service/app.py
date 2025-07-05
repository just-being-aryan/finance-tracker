from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow requests from your backend (cross-origin)

@app.route('/analyze', methods=['POST'])
def analyze_expenses():
    data = request.get_json()

    if not data or 'expenses' not in data:
        return jsonify({"error": "Invalid payload"}), 400

    expenses = data['expenses']

    total_spent = sum(exp['amount'] for exp in expenses)

    # Spending by category
    category_map = {}
    for exp in expenses:
        category = exp.get('category', 'Other')
        category_map[category] = category_map.get(category, 0) + exp['amount']

    # Find top category
    top_category = max(category_map, key=category_map.get)
    top_amount = category_map[top_category]

    # Response
    return jsonify({
        "total_spent": total_spent,
        "top_category": top_category,
        "top_amount": top_amount,
        "category_breakdown": category_map
    }), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
