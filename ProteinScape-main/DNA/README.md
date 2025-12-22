<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# GenFlow AI - Genetic + Blood ML Analysis

This application combines a React frontend with a Streamlit-based protein structure prediction tool (ProteinScape) for comprehensive genetic analysis.

## Features

- **React Frontend**: Modern UI for genetic and blood analysis workflow
- **Protein Structure Prediction**: Integrated Streamlit app for 3D protein visualization
- **Real-time Analysis**: Live pipeline workflow visualization
- **Risk Analysis**: ML-based risk scoring and biomarker analysis

## Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

## Installation

### 1. Install Node.js Dependencies

```bash
npm install
```

### 2. Install Python Dependencies

```bash
npm run install:python
```

Or manually:
```bash
pip install -r requirements.txt
```

### 3. Set Environment Variables (Optional)

If you need Gemini API key:
- Create a `.env.local` file
- Add: `GEMINI_API_KEY=your_api_key_here`

## Running the Application

### Option 1: Run Both Servers Together (Recommended)

This will start both the React app and Streamlit server:

```bash
npm run start:both
```

Or use PowerShell:
```powershell
.\start-both.ps1
```

Or use the batch file:
```cmd
start-both.bat
```

### Option 2: Run Servers Separately

**Terminal 1 - Start Streamlit:**
```bash
npm run start:streamlit
```

**Terminal 2 - Start React App:**
```bash
npm run dev
```

## Access the Application

Once running, you can access:

- **React Frontend**: http://localhost:5173
- **Streamlit App (Direct)**: http://localhost:8501

The Streamlit protein structure prediction tool is automatically embedded in the React app during the "Protein Folding" step of the analysis pipeline.

## Project Structure

```
DNA/
├── app.py                 # Streamlit protein structure prediction app
├── App.tsx               # Main React application
├── components/           # React components
│   ├── DemoInterface.tsx # Main demo interface
│   └── Visualizations/
│       └── ProteinFold.tsx # Streamlit iframe integration
├── package.json          # Node.js dependencies
├── requirements.txt      # Python dependencies
└── start-both.js        # Script to run both servers
```

## Troubleshooting

### Streamlit not loading in React app

1. Ensure Streamlit is running on port 8501:
   ```bash
   streamlit run app.py --server.port 8501
   ```

2. Check that both servers are running:
   - React: http://localhost:5173
   - Streamlit: http://localhost:8501

3. If you see connection errors, wait a few seconds for Streamlit to fully start before accessing the React app.

### Port conflicts

- React app uses port **5173** (configurable in `vite.config.ts`)
- Streamlit uses port **8501** (configurable in `app.py` or start scripts)

If these ports are in use, you can change them in the respective configuration files.

## Development

- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
