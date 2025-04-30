from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
CORS(app)  

df = pd.read_csv(r"c:\Users\User\Desktop\Agri-connect\product-ml\productdata.csv")

# Normalize columns: set lowercase & trim spaces
df.columns = df.columns.str.lower().str.strip()
# Fix column name if it's misspelled in your CSV
df.rename(columns={'distrcit': 'district'}, inplace=True)

province_encoder = LabelEncoder()
district_encoder = LabelEncoder()
df['province_code'] = province_encoder.fit_transform(df['province'])
df['district_code'] = district_encoder.fit_transform(df['district'])

@app.route('/api/suggestions', methods=['GET'])
def suggest_products():
    province = request.args.get('province', '').lower()
    district = request.args.get('district', '').lower()

    if not province or not district:
        return jsonify({"error": "Missing province or district parameter"}), 400

    matched_products = df[
        (df['province'] == province) & (df['district'] == district)
    ]['productname'].unique()

    # Return the results as JSON
    if len(matched_products) > 0:
        return jsonify({"products": list(matched_products)})
    else:
        return jsonify({"products": [], "message": "No products found for this region."})

if __name__ == '__main__':
    # Run the server on port 5000 in debug mode
    app.run(debug=True, port=5000)
