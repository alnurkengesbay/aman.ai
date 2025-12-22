import React from 'react';
import ProteinFold from './components/Visualizations/ProteinFold';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-grid-pattern text-gray-900 pb-20 font-sans">
      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 pt-12">
        
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">Protein Structure Prediction</h1>
          
          <div className="max-w-2xl">
            <p className="text-gray-500 leading-relaxed text-base">
              Predict and visualize the 3D structure of proteins from their amino acid sequences. 
              Enter a protein sequence to see its predicted structure, amino acid distribution, and download the PDB file.
            </p>
          </div>
        </div>

        {/* Protein Structure Prediction Component */}
        <div className="mb-16">
          <ProteinFold />
        </div>

      </main>
    </div>
  );
};

export default App;
