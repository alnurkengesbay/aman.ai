import React, { useState } from 'react';
import { BloodTestInput } from '../types';

interface BloodTestFormProps {
  onSubmit: (data: BloodTestInput) => void;
  isLoading?: boolean;
}

const BLOOD_TEST_FIELDS = [
  { key: 'WBC' as keyof BloodTestInput, label: 'WBC Count', placeholder: 'Enter WBC Count', unit: '×10³/μL' },
  { key: 'RBC' as keyof BloodTestInput, label: 'RBC Count', placeholder: 'Enter RBC Count', unit: '×10⁶/μL' },
  { key: 'HGB' as keyof BloodTestInput, label: 'Hemoglobin', placeholder: 'Enter Hemoglobin Level', unit: 'g/dL' },
  { key: 'PLT' as keyof BloodTestInput, label: 'Platelet Count', placeholder: 'Enter Platelet Count', unit: '×10³/μL' },
  { key: 'NEUT' as keyof BloodTestInput, label: 'Neutrophils', placeholder: 'Enter Neutrophils %', unit: '%' },
  { key: 'LYMPH' as keyof BloodTestInput, label: 'Lymphocytes', placeholder: 'Enter Lymphocytes %', unit: '%' },
  { key: 'MONO' as keyof BloodTestInput, label: 'Monocytes', placeholder: 'Enter Monocytes %', unit: '%' },
  { key: 'EO' as keyof BloodTestInput, label: 'Eosinophils', placeholder: 'Enter Eosinophils %', unit: '%' },
  { key: 'BASO' as keyof BloodTestInput, label: 'Basophils', placeholder: 'Enter Basophils %', unit: '%' },
];

export const BloodTestForm: React.FC<BloodTestFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<BloodTestInput>({
    WBC: 0,
    RBC: 0,
    HGB: 0,
    PLT: 0,
    NEUT: 0,
    LYMPH: 0,
    MONO: 0,
    EO: 0,
    BASO: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BloodTestInput, string>>>({});

  const handleChange = (key: keyof BloodTestInput, value: string) => {
    const numValue = parseFloat(value);
    setFormData(prev => ({ ...prev, [key]: isNaN(numValue) ? 0 : numValue }));
    
    // Clear error for this field
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BloodTestInput, string>> = {};
    
    BLOOD_TEST_FIELDS.forEach(field => {
      const value = formData[field.key];
      if (value === 0 || isNaN(value) || value < 0) {
        newErrors[field.key] = `Please enter a valid positive number for ${field.label}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-semibold text-slate-900 mb-6">Enter Blood Test Results</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {BLOOD_TEST_FIELDS.map((field) => (
          <div key={field.key} className="flex flex-col">
            <label 
              htmlFor={field.key}
              className="text-sm font-medium text-slate-700 mb-1.5"
            >
              {field.label}
              {field.unit && <span className="text-slate-400 ml-1">({field.unit})</span>}
            </label>
            <input
              type="number"
              id={field.key}
              step="any"
              min="0"
              value={formData[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              className={`px-4 py-2.5 border rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all ${
                errors[field.key] 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              disabled={isLoading}
            />
            {errors[field.key] && (
              <p className="text-xs text-red-600 mt-1">{errors[field.key]}</p>
            )}
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`mt-6 w-full px-6 py-3 rounded-lg font-medium text-white transition-all ${
          isLoading
            ? 'bg-slate-400 cursor-not-allowed'
            : 'bg-black hover:bg-slate-800'
        }`}
      >
        {isLoading ? 'Analyzing...' : 'Analyze Blood Test'}
      </button>
    </form>
  );
};

