import React, { useState, useEffect } from 'react';
import { Icons } from './Icons';
import { AnalysisStep, BloodTestInput, BloodTestResult } from '../types';
import { FileUpload } from './FileUpload';
import { analyzeBloodTest } from '../services/bloodTestApi';
import { jsPDF } from "jspdf";

const STEPS: (AnalysisStep & { icon: React.ElementType })[] = [
  { id: 1, title: 'Collection', description: 'Sample logged', status: 'waiting', icon: Icons.TestTube },
  { id: 2, title: 'Upload', description: 'Secure transfer', status: 'waiting', icon: Icons.UploadCloud },
  { id: 3, title: 'Analysis', description: 'Pattern check', status: 'waiting', icon: Icons.Cpu },
  { id: 4, title: 'Insights', description: 'Risk stratification', status: 'waiting', icon: Icons.TrendingUp },
];

export const DemoSection: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const [activeStep, setActiveStep] = useState(0);
  const [bloodTestResult, setBloodTestResult] = useState<BloodTestResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Simulation effect for steps
  useEffect(() => {
    if (status === 'running') {
      let currentStep = 0;
      const stepInterval = setInterval(() => {
        currentStep++;
        setActiveStep(currentStep);

        if (currentStep >= STEPS.length + 1) {
          clearInterval(stepInterval);
        }
      }, 800);

      return () => clearInterval(stepInterval);
    } else if (status === 'idle') {
      setActiveStep(0);
      setBloodTestResult(null);
      setError(null);
    }
  }, [status]);

  const handleFileParsed = async (data: BloodTestInput) => {
    setStatus('running');
    setError(null);
    setActiveStep(0);

    try {
      // Simulate progress while API call is in progress
      const analysisPromise = analyzeBloodTest(data);
      
      // Wait for API response
      const result = await analysisPromise;
      
      // Complete the steps animation
      setActiveStep(STEPS.length + 1);
      
      // Small delay to show final step completion
      setTimeout(() => {
        setBloodTestResult(result);
        setStatus('complete');
      }, 500);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    }
  };

  const handleFileError = (errorMessage: string) => {
    setStatus('error');
    setError(errorMessage);
  };

  const resetDemo = () => {
    setStatus('idle');
    setBloodTestResult(null);
    setError(null);
  };

  const handleDownloadReport = () => {
    if (!bloodTestResult) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("AI Blood Analysis Report", 20, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 28);
    
    // Disease Detection Section
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Detected Condition", 20, 45);
    
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105);
    doc.text(`Disease: ${bloodTestResult.disease}`, 20, 55);
    
    // Causes Section
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    let yPos = 70;
    doc.text("Possible Causes", 20, yPos);
    
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    yPos += 10;
    const causeLines = doc.splitTextToSize(bloodTestResult.cause, 170);
    doc.text(causeLines, 20, yPos);
    
    // Input Values Section
    yPos += causeLines.length * 7 + 15;
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Blood Test Values", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text("PARAMETER", 20, yPos);
    doc.text("VALUE", 120, yPos);
    
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(20, yPos + 3, 190, yPos + 3);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(71, 85, 105);
    
    const values = bloodTestResult.input_values;
    const valueLabels = [
      { key: 'WBC', label: 'WBC Count' },
      { key: 'RBC', label: 'RBC Count' },
      { key: 'HGB', label: 'Hemoglobin' },
      { key: 'PLT', label: 'Platelet Count' },
      { key: 'NEUT', label: 'Neutrophils' },
      { key: 'LYMPH', label: 'Lymphocytes' },
      { key: 'MONO', label: 'Monocytes' },
      { key: 'EO', label: 'Eosinophils' },
      { key: 'BASO', label: 'Basophils' },
    ];
    
    valueLabels.forEach((item) => {
      doc.setTextColor(15, 23, 42);
      doc.text(item.label, 20, yPos);
      doc.setTextColor(71, 85, 105);
      doc.text(String(values[item.key as keyof BloodTestInput]), 120, yPos);
      doc.setDrawColor(241, 245, 249);
      doc.line(20, yPos + 5, 190, yPos + 5);
      yPos += 10;
    });
    
    doc.save(`Blood_Analysis_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getDiseaseStatusColor = (disease: string) => {
    if (disease === 'Normal') {
      return 'bg-emerald-50 text-emerald-700 border-emerald-100';
    }
    return 'bg-red-50 text-red-700 border-red-100';
  };

  // Format cause text for display
  const formatCauseText = (cause: string) => {
    return cause.split('\n').filter(line => line.trim().length > 0);
  };

  return (
    <div className="space-y-8">
      
      {/* VIEW 1: IDLE - Show Upload Box */}
      {status === 'idle' && (
        <>
          <FileUpload 
            onFileParsed={handleFileParsed}
            onError={handleFileError}
            isLoading={false}
          />

          {/* Analysis Steps - At Bottom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              
              return (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-normal text-slate-500 mb-1">{step.title}</h4>
                      <p className="text-base font-semibold text-slate-900">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: RUNNING - Show Steps */}
      {status === 'running' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-4">
          {STEPS.map((step, i) => {
             const Icon = step.icon;
             const isActive = activeStep === i + 1;
             const isDone = activeStep > i + 1;
             
             return (
              <div key={i} className={`bg-white p-6 rounded-xl border transition-all duration-300 ${isActive ? 'border-slate-400 shadow-md' : 'border-slate-200'}`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-black text-white' : isDone ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-600'}`}>
                    {isDone ? <Icons.Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-normal text-slate-500 mb-1">{step.title}</h4>
                    <p className="text-base font-semibold text-slate-900">{step.description}</p>
                  </div>
                </div>
              </div>
             )
          })}
        </div>
      )}

      {/* VIEW 3: ERROR - Show Error Message */}
      {status === 'error' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Icons.AlertCircle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Error</h3>
            </div>
            <p className="text-red-700 mb-6">{error || 'An unknown error occurred'}</p>
            <button
              onClick={resetDemo}
              className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* VIEW 4: COMPLETE - Show Results */}
      {status === 'complete' && bloodTestResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8">
           
           {/* Disease Detection Result Card */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Icons.Brain className="w-6 h-6 text-slate-900" />
                <h3 className="text-xl font-semibold text-slate-900">Analysis Result</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-600">Detected Condition</label>
                  <div className="mt-2 flex items-center gap-3">
                    <span className={`px-4 py-2 border text-base font-bold rounded-full ${getDiseaseStatusColor(bloodTestResult.disease)}`}>
                      {bloodTestResult.disease}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-600">Possible Causes</label>
                  <div className="mt-2 p-4 bg-slate-50 rounded-xl">
                    <ul className="space-y-2">
                      {formatCauseText(bloodTestResult.cause).map((line, idx) => (
                        <li key={idx} className="text-slate-700 text-sm leading-relaxed flex items-start gap-2">
                          <span className="text-slate-900 mt-1">•</span>
                          <span>{line.trim()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
           </div>

           {/* Blood Test Values Card */}
           <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Blood Test Values</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(bloodTestResult.input_values).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm font-medium text-slate-700">{key}</span>
                    <span className="text-sm font-semibold text-slate-900">{value}</span>
                  </div>
                ))}
              </div>
           </div>

           {/* Action Buttons */}
           <div className="flex gap-3">
             <button 
               onClick={handleDownloadReport}
               className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-slate-800 transition-colors"
             >
               <Icons.Download className="w-5 h-5" />
               Download Report
             </button>
             <button 
               onClick={resetDemo}
               className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
             >
               New Analysis
             </button>
           </div>
        </div>
      )}
    </div>
  );
};
