from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the main dataset
df_main = pd.read_csv("Training.csv")

# Diseases mapping
disease = {0: 'Anemia', 1: 'Polycythemia', 2: 'Leukocytosis', 3: 'Leukopenia', 4: 'Thrombocytopenia',
           5: 'Thrombocytosis', 6: 'Neutropenia', 7: 'Neutrophilia', 8: 'Lymphocytopenia', 9: 'Lymphocytosis',
           10: 'Monocytes high', 11: 'Eosinophil high', 12: 'Basophil high', 13: 'Normal'}

# Causes mapping
Rea = {0: [' - Anemia due to blood loss \n'
            ' - Bone marrow disorders \n'
            ' - Nutritional deficiency \n'
            ' - Chronic Kidney disease  \n'
            ' - Chronic inflammatory disease \n'],
       1: ['- Dehydration, such as from severe diarrhea \n'
           '- tumours \n'
           '- Lung diseases \n'
           '- Smoking \n'
           '- Polycythemia vera \n'],
       2: ['- Infection \n'
           '- Leukemia \n'
           '- Inflammation \n'
           '- Stress, allergies, asthma \n'],
       3: ['- Viral infection \n'
           '- Severe bacterial infection \n'
           '- Bone marrow disorders \n'
           '- Autoimmune conditions \n'
           '- Lymphoma \n'
           '- Dietary deficiencies \n'],
       4: ['- Cancer, such as leukemia or lymphoma \n'
           '- Autoimmune diseases \n'
           '- Bacterial infection \n'
           '- Viral infection like dengue \n'
           '- Chemotherapy or radiation therapy \n'
           '- Certain drugs, such as nonsteroidal anti-inflammatory drugs (NSAIDs) \n'],
       5: ['- Bone marrow disorders \n'
           '- Essential thrombocythemia \n'
           '- Anemia \n'
           '- Infection \n'
           '- Surgical removal of the spleen \n'
           '- Polycythemia vera \n'
           '- Some types of leukemia \n'],
       6: ['- Severe infection \n'
           '- Immunodeficiency \n'
           '- Autoimmune disorders \n'
           '- Dietary deficiencies \n'
           '- Reaction to drugs \n'
           '- Bone marrow damage \n'],
       7: ['- Acute bacterial infections \n'
           '- Inflammation \n'
           '- Stress, Trauma \n'
           '- Certain leukemias \n'],
       8: ['- Autoimmune disorders \n'
           '- Infections \n'
           '- Bone marrow damage \n'
           '- Corticosteroids \n'],
       9: ['- Acute viral infections \n'
           '- Certain bacterial infections \n'
           '- Chronic inflammatory disorder \n'
           '- Lymphocytic leukemia, lymphoma \n'
           '- Acute stress \n'],
       10: ['- Chronic infections \n'
            '- Infection within the heart \n'
            '- Collagen vascular diseases \n'
            '- Monocytic or myelomonocytic leukemia \n'],
       11: ['- Asthma, allergies such as hay fever \n'
            '- Drug reactions \n'
            '- Parasitic infections \n'
            '- Inflammatory disorders \n'
            '- Some cancers, leukemias or lymphomas \n'],
       12: ['- Rare allergic reactions \n'
            '- Inflammation \n'
            '- Some leukemias \n'
            '- Uremia \n'],
       13: ['- Normal \n']}

# Function to train and predict using RandomForestClassifier
def rf(W, R, H, P, N, L, M, E, B):
    # Load the dataset and split into features and target variable
    x = df_main.drop(columns=['Disease'], axis=1)
    y = df_main['Disease']

    # Split the dataset into training and testing sets
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=40)

    # Initialize and train the RandomForestClassifier
    clf = RandomForestClassifier(n_estimators=100)
    clf.fit(x_train, y_train)

    # Prepare input data as numpy array
    t = np.array([W, R, H, P, N, L, M, E, B]).reshape(1, -1)

    # Predict using the trained model
    res = clf.predict(t)[0]
    return res

@app.route('/api/analyze', methods=['POST'])
def analyze_blood_test():
    try:
        data = request.get_json()
        
        # Validate input data
        required_fields = ['WBC', 'RBC', 'HGB', 'PLT', 'NEUT', 'LYMPH', 'MONO', 'EO', 'BASO']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Extract values
        W = float(data['WBC'])
        R = float(data['RBC'])
        H = float(data['HGB'])
        P = float(data['PLT'])
        N = float(data['NEUT'])
        L = float(data['LYMPH'])
        M = float(data['MONO'])
        E = float(data['EO'])
        B = float(data['BASO'])

        # Call the RandomForestClassifier function
        result = rf(W, R, H, P, N, L, M, E, B)

        # Get the disease name and cause
        disease_name = disease[result]
        cause = Rea[result][0]

        # Return JSON response
        return jsonify({
            'success': True,
            'disease': disease_name,
            'cause': cause,
            'result_code': int(result),
            'input_values': {
                'WBC': W,
                'RBC': R,
                'HGB': H,
                'PLT': P,
                'NEUT': N,
                'LYMPH': L,
                'MONO': M,
                'EO': E,
                'BASO': B
            }
        })
    except ValueError as e:
        return jsonify({'error': f'Invalid input: {str(e)}'}), 400
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'ok', 'message': 'Blood Test Analysis API is running'})

@app.route('/api/parse-pdf', methods=['POST'])
def parse_pdf():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.lower().endswith('.pdf'):
            return jsonify({'error': 'File must be a PDF'}), 400
        
        # For now, return a message that PDF parsing should be done on frontend
        # In production, you could add PyPDF2 or pdfplumber here
        return jsonify({
            'error': 'PDF parsing is currently handled on the frontend. Please use the web interface.'
        }), 501
        
    except Exception as e:
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

