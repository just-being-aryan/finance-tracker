import pandas as pd

def analyze_expenses(expenses):
    df = pd.DataFrame(expenses)
    
    if 'category' not in df or 'amount' not in df:
        return {'error': 'Invalid data format'}

    summary = df.groupby('category')['amount'].sum().to_dict()

    suggestions = []
    for category, amount in summary.items():
        if amount > 1000:
            suggestions.append(f"High spending in {category}: ₹{amount}")

    return {
        "summary": summary,
        "suggestions": suggestions
    }
