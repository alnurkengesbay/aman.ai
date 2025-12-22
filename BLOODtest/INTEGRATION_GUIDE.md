# Blood Test Feature Integration Guide

This guide explains how to run the integrated blood test analysis feature with both the React frontend and Flask backend.

## Architecture

- **Frontend**: React + TypeScript + Vite (Port 3000)
- **Backend**: Flask API with Machine Learning model (Port 5000)
- **ML Model**: Random Forest Classifier for blood disease detection

## Prerequisites

- Python 3.8+ with pip
- Node.js 16+ with npm
- The Training.csv file in the Flask app directory

## Setup Instructions

### 1. Flask Backend Setup

Navigate to the Flask app directory:
```bash
cd Blood-Report-Disease-Diagnosis-App-main
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Run the Flask API server:
```bash
python api.py
```

The API will be available at `http://localhost:5000`

### 2. React Frontend Setup

Navigate back to the project root:
```bash
cd ..
```

Install Node.js dependencies:
```bash
npm install
```

Create a `.env` file in the root directory (optional, for API URL customization):
```env
VITE_FLASK_API_URL=http://localhost:5000
```

Run the React development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Enter your blood test values in the form:
   - WBC Count (×10³/μL)
   - RBC Count (×10⁶/μL)
   - Hemoglobin (g/dL)
   - Platelet Count (×10³/μL)
   - Neutrophils (%)
   - Lymphocytes (%)
   - Monocytes (%)
   - Eosinophils (%)
   - Basophils (%)
3. Click "Analyze Blood Test"
4. Wait for the analysis to complete
5. View the detected condition and possible causes
6. Download the report as PDF if needed

## API Endpoints

### POST `/api/analyze`
Analyzes blood test data and returns disease prediction.

**Request Body:**
```json
{
  "WBC": 5.0,
  "RBC": 4.7,
  "HGB": 13.0,
  "PLT": 200,
  "NEUT": 60,
  "LYMPH": 30,
  "MONO": 4,
  "EO": 2,
  "BASO": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "disease": "Anemia",
  "cause": " - Anemia due to blood loss \n - Bone marrow disorders \n...",
  "result_code": 0,
  "input_values": { ... }
}
```

### GET `/api/health`
Health check endpoint to verify API is running.

## Detected Conditions

The system can detect the following conditions:
- Anemia
- Polycythemia
- Leukocytosis
- Leukopenia
- Thrombocytopenia
- Thrombocytosis
- Neutropenia
- Neutrophilia
- Lymphocytopenia
- Lymphocytosis
- Monocytes high
- Eosinophil high
- Basophil high
- Normal

## Troubleshooting

### CORS Errors
If you encounter CORS errors, ensure:
- Flask-CORS is installed: `pip install flask-cors`
- The Flask server is running on port 5000
- The React app is running on port 3000

### API Connection Issues
- Verify the Flask server is running: `http://localhost:5000/api/health`
- Check that `VITE_FLASK_API_URL` in `.env` matches your Flask server URL
- Ensure no firewall is blocking the connection

### Missing Training.csv
The `Training.csv` file must be in the `Blood-Report-Disease-Diagnosis-App-main` directory for the ML model to work.

## Files Structure

```
.
├── App.tsx                          # Main React app
├── components/
│   ├── DemoSection.tsx              # Main blood test analysis component
│   ├── BloodTestForm.tsx            # Form for blood test inputs
│   └── Icons.tsx                    # Icon components
├── services/
│   └── bloodTestApi.ts              # API service for Flask communication
├── types.ts                         # TypeScript type definitions
└── Blood-Report-Disease-Diagnosis-App-main/
    ├── api.py                       # Flask API endpoint
    ├── main.py                      # Original Flask app (optional)
    ├── Training.csv                 # ML training data
    └── requirements.txt             # Python dependencies
```

## Notes

- The ML model is trained on the Training.csv dataset
- Each analysis triggers a model training (for demonstration). In production, you'd load a pre-trained model
- Results are for informational purposes only and should not replace professional medical advice

