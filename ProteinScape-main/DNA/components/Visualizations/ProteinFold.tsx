import React, { useState } from 'react';
import { Loader2, Download, AlertCircle, CheckCircle2, Upload } from 'lucide-react';
import { validateSequence, predictStructure, calculateAminoAcidDistribution, downloadPDB } from '../../utils/proteinUtils';
import ProteinStructureViewer from './ProteinStructureViewer';
import AminoAcidChart from './AminoAcidChart';
import RamachandranPlot from './RamachandranPlot';

const DEFAULT_SEQUENCE = "MKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL";

interface SequenceResult {
  sequence: string;
  pdbContent: string | null;
  index: number;
}

const ProteinFold: React.FC = () => {
  const [predictionMode, setPredictionMode] = useState<'single' | 'multiple'>('single');
  
  // Single prediction state
  const [sequence, setSequence] = useState<string>(DEFAULT_SEQUENCE);
  const [pdbContent, setPdbContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationStyle, setVisualizationStyle] = useState<'cartoon' | 'stick' | 'sphere' | 'line'>('cartoon');
  const [aminoAcidDistribution, setAminoAcidDistribution] = useState<{ aminoAcid: string; count: number }[]>([]);

  // Multiple prediction state
  const [fastaInput, setFastaInput] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [multipleResults, setMultipleResults] = useState<SequenceResult[]>([]);
  const [isProcessingMultiple, setIsProcessingMultiple] = useState<boolean>(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);

  const handlePredict = async () => {
    if (!sequence || sequence.trim().length === 0) {
      setError('Please enter a protein sequence.');
      return;
    }

    if (!validateSequence(sequence)) {
      setError('Invalid sequence. Please enter a valid protein sequence containing only standard amino acid characters (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y).');
      return;
    }

    setIsLoading(true);
    setError(null);
    setPdbContent(null);

    try {
      const cleanSequence = sequence.replace(/\s/g, '').toUpperCase();
      
      if (cleanSequence.length > 1500) {
        setError('Sequence is too long. Maximum length is 1500 amino acids.');
        setIsLoading(false);
        return;
      }

      const pdb = await predictStructure(cleanSequence);
      
      if (pdb) {
        setPdbContent(pdb);
        const distribution = calculateAminoAcidDistribution(cleanSequence);
        setAminoAcidDistribution(distribution);
      } else {
        setError('Failed to predict structure. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while predicting the structure. Please try again.');
      console.error('Prediction error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const parseFastaSequences = (text: string): string[] => {
    const sequences: string[] = [];
    const parts = text.split('>').filter(part => part.trim());
    
    for (const part of parts) {
      const lines = part.split('\n');
      const sequence = lines.slice(1).join('').replace(/\s/g, '').toUpperCase();
      if (sequence && validateSequence(sequence)) {
        sequences.push(sequence);
      }
    }
    
    return sequences;
  };

  const handleMultiplePredict = async () => {
    let sequences: string[] = [];

    if (uploadedFile) {
      const text = await uploadedFile.text();
      sequences = parseFastaSequences(text);
    } else if (fastaInput) {
      sequences = parseFastaSequences(fastaInput);
    }

    if (sequences.length === 0) {
      setError('Please upload a FASTA file or enter sequences in FASTA format.');
      return;
    }

    setIsProcessingMultiple(true);
    setError(null);
    setMultipleResults([]);
    setProcessingProgress(0);

    const results: SequenceResult[] = [];

    for (let i = 0; i < sequences.length; i++) {
      const seq = sequences[i];
      
      if (seq.length > 1500) {
        setError(`Sequence ${i + 1} is too long and will be skipped (max length: 1500 characters).`);
        continue;
      }

      if (!validateSequence(seq)) {
        setError(`Sequence ${i + 1} contains invalid characters and will be skipped.`);
        continue;
      }

      try {
        const pdb = await predictStructure(seq);
        results.push({
          sequence: seq,
          pdbContent: pdb,
          index: i + 1
        });
      } catch (err) {
        console.error(`Error predicting sequence ${i + 1}:`, err);
      }

      setProcessingProgress(((i + 1) / sequences.length) * 100);
    }

    setMultipleResults(results);
    setIsProcessingMultiple(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setFastaInput('');
    }
  };

  const handleDownload = (pdbContent: string, filename: string = 'predicted_structure.pdb') => {
    downloadPDB(pdbContent, filename);
  };

  const isValidSequence = sequence && validateSequence(sequence);

  return (
    <div className="w-full space-y-8">
      {/* Mode Selection */}
      <div className="bg-white p-8 rounded-lg border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Choose Prediction Type:</h2>
        <div className="flex gap-4">
          <button
            onClick={() => setPredictionMode('single')}
            className={`px-6 py-3 rounded font-medium transition-all ${
              predictionMode === 'single'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Single Protein Structure Prediction
          </button>
          <button
            onClick={() => setPredictionMode('multiple')}
            className={`px-6 py-3 rounded font-medium transition-all ${
              predictionMode === 'multiple'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Multiple Protein Structure Prediction
          </button>
        </div>
      </div>

      {/* Single Protein Prediction */}
      {predictionMode === 'single' && (
        <>
          {/* Input Section */}
          <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
            <div className="mb-6">
              <label htmlFor="protein-sequence" className="block text-sm font-medium text-gray-700 mb-3">
                Enter Protein Sequence
              </label>
              <textarea
                id="protein-sequence"
                value={sequence}
                onChange={(e) => {
                  setSequence(e.target.value);
                  setError(null);
                  if (validateSequence(e.target.value)) {
                    const distribution = calculateAminoAcidDistribution(e.target.value);
                    setAminoAcidDistribution(distribution);
                  }
                }}
                placeholder="Enter your protein sequence here (e.g., MKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL)"
                className="w-full h-56 p-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-mono text-sm bg-white"
                disabled={isLoading}
              />
              <p className="mt-3 text-xs text-gray-500">
                Enter amino acid sequence using single-letter codes (A, C, D, E, F, G, H, I, K, L, M, N, P, Q, R, S, T, V, W, Y)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {isValidSequence && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-gray-600" />
                    </div>
                    <span>Valid sequence ({sequence.replace(/\s/g, '').length} amino acids)</span>
                  </div>
                )}
              </div>
              <button
                onClick={handlePredict}
                disabled={isLoading || !sequence.trim()}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded font-medium transition-all
                  ${isLoading || !sequence.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Predicting Structure...</span>
                  </>
                ) : (
                  <span>Start analysis</span>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="text-red-600" size={14} />
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* 3D Structure Visualization */}
          {pdbContent && (
            <div className="bg-white p-8 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Predicted Protein Structure</h3>
                <div className="flex items-center gap-4">
                  <select
                    value={visualizationStyle}
                    onChange={(e) => setVisualizationStyle(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                  >
                    <option value="cartoon">Cartoon</option>
                    <option value="stick">Stick</option>
                    <option value="sphere">Sphere</option>
                    <option value="line">Line</option>
                  </select>
                  <button
                    onClick={() => handleDownload(pdbContent)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                  >
                    <Download size={16} />
                    <span>Download PDB</span>
                  </button>
                </div>
              </div>
              <div className="flex justify-center w-full overflow-x-auto">
                <div className="w-full max-w-4xl">
                  <ProteinStructureViewer
                    pdbContent={pdbContent}
                    style={visualizationStyle}
                    width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 100 : 800)}
                    height={500}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Amino Acid Distribution Chart */}
          {isValidSequence && aminoAcidDistribution.length > 0 && (
            <div>
              <AminoAcidChart data={aminoAcidDistribution} />
            </div>
          )}

          {/* Ramachandran Plot */}
          {pdbContent && (
            <div>
              <RamachandranPlot />
            </div>
          )}
        </>
      )}

      {/* Multiple Protein Prediction */}
      {predictionMode === 'multiple' && (
        <>
          <div className="bg-white p-8 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Upload FASTA File or Enter Sequences</h3>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Upload FASTA File (Optional):
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium cursor-pointer transition-colors">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <Upload size={16} className="text-gray-600" />
                  </div>
                  <span>Select file</span>
                  <input
                    type="file"
                    accept=".fasta,.txt,.fa"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploadedFile && (
                  <span className="text-sm text-gray-600">{uploadedFile.name}</span>
                )}
              </div>
              <p className="mt-2 text-xs text-gray-500">FASTA or TXT files (up to 20 MB)</p>
            </div>

            <div className="mb-6">
              <label htmlFor="fasta-input" className="block text-sm font-medium text-gray-700 mb-3">
                Or enter multiple protein sequences (FASTA format):
              </label>
              <textarea
                id="fasta-input"
                value={fastaInput}
                onChange={(e) => {
                  setFastaInput(e.target.value);
                  setUploadedFile(null);
                  setError(null);
                }}
                placeholder={">Sequence 1\nMKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL\n>Sequence 2\nMKTAYIAKQRQISFVKSHFSRQDILDLWQYFSYGRAL"}
                className="w-full h-48 p-4 border border-gray-300 rounded focus:ring-2 focus:ring-gray-400 focus:border-gray-400 font-mono text-sm bg-white"
                disabled={isProcessingMultiple}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleMultiplePredict}
                disabled={isProcessingMultiple || (!fastaInput && !uploadedFile)}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded font-medium transition-all
                  ${isProcessingMultiple || (!fastaInput && !uploadedFile)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800'
                  }
                `}
              >
                {isProcessingMultiple ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Processing Sequences... {Math.round(processingProgress)}%</span>
                  </>
                ) : (
                  <span>Start analysis</span>
                )}
              </button>
            </div>

            {isProcessingMultiple && (
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-black h-2 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded flex items-start gap-3">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertCircle className="text-red-600" size={14} />
                </div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Multiple Results */}
          {multipleResults.length > 0 && (
            <div className="space-y-8">
              {multipleResults.map((result, idx) => (
                <div key={idx} className="bg-white p-8 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Predicted Structure for Sequence {result.index}
                    </h3>
                    <div className="flex items-center gap-4">
                      <select
                        className="px-4 py-2 border border-gray-300 rounded text-sm bg-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400"
                        defaultValue="cartoon"
                      >
                        <option value="cartoon">Cartoon</option>
                        <option value="stick">Stick</option>
                        <option value="sphere">Sphere</option>
                        <option value="line">Line</option>
                      </select>
                      {result.pdbContent && (
                        <button
                          onClick={() => handleDownload(result.pdbContent!, `predicted_structure_sequence_${result.index}.pdb`)}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                        >
                          <Download size={16} />
                          <span>Download PDB</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {result.pdbContent ? (
                    <>
                      <div className="flex justify-center w-full overflow-x-auto mb-4">
                        <div className="w-full max-w-4xl">
                          <ProteinStructureViewer
                            pdbContent={result.pdbContent}
                            style="cartoon"
                            width={Math.min(800, typeof window !== 'undefined' ? window.innerWidth - 100 : 800)}
                            height={500}
                          />
                        </div>
                      </div>
                      <div className="mb-4">
                        <AminoAcidChart data={calculateAminoAcidDistribution(result.sequence)} />
                      </div>
                      <div>
                        <RamachandranPlot />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Failed to predict structure for this sequence.</p>
                  )}
                </div>
              ))}

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <p className="text-sm text-gray-700">
                  <strong>Summary:</strong> Successfully processed {multipleResults.length} sequence(s).
                </p>
          </div>
        </div>
          )}
        </>
      )}

    </div>
  );
};

export default ProteinFold;
