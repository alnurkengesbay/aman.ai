import Papa from 'papaparse';
import * as pdfjsLib from 'pdfjs-dist';
import { BloodTestInput } from '../types';

// Set up PDF.js worker - try multiple sources for better compatibility
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
} catch (e) {
  // Fallback
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface ParseResult {
  success: boolean;
  data?: BloodTestInput;
  error?: string;
}

// Expected field mappings for CSV/PDF
const FIELD_MAPPINGS: Record<string, keyof BloodTestInput> = {
  'wbc': 'WBC',
  'white blood cell': 'WBC',
  'white blood cell count': 'WBC',
  'rbc': 'RBC',
  'red blood cell': 'RBC',
  'red blood cell count': 'RBC',
  'hgb': 'HGB',
  'hemoglobin': 'HGB',
  'hgb/hemoglobin': 'HGB',
  'plt': 'PLT',
  'platelet': 'PLT',
  'platelets': 'PLT',
  'platelet count': 'PLT',
  'neut': 'NEUT',
  'neutrophils': 'NEUT',
  'neutrophil': 'NEUT',
  'lymph': 'LYMPH',
  'lymphocytes': 'LYMPH',
  'lymphocyte': 'LYMPH',
  'mono': 'MONO',
  'monocytes': 'MONO',
  'monocyte': 'MONO',
  'eo': 'EO',
  'eosinophils': 'EO',
  'eosinophil': 'EO',
  'baso': 'BASO',
  'basophils': 'BASO',
  'basophil': 'BASO',
};

/**
 * Extract numeric value from text, handling units and formatting
 */
const extractValue = (text: string): number | null => {
  if (!text) return null;
  
  // Remove common units and clean the text
  const cleaned = text
    .toString()
    .toLowerCase()
    .replace(/[×x*]/g, '')
    .replace(/10\^?[³3]/g, '') // Remove ×10³
    .replace(/10\^?[⁶6]/g, '') // Remove ×10⁶
    .replace(/\/\s*(μl|ul|dl|l)/gi, '') // Remove /μL, /dL, etc.
    .replace(/%/g, '') // Remove %
    .replace(/[^\d.]/g, ' ') // Replace non-numeric with space
    .trim();
  
  // Extract the first number
  const match = cleaned.match(/[\d.]+/);
  if (match) {
    const value = parseFloat(match[0]);
    return isNaN(value) ? null : value;
  }
  
  return null;
};

/**
 * Find field name in text (case-insensitive)
 */
const findField = (text: string): keyof BloodTestInput | null => {
  const lowerText = text.toLowerCase().trim();
  
  for (const [key, value] of Object.entries(FIELD_MAPPINGS)) {
    if (lowerText.includes(key)) {
      return value;
    }
  }
  
  return null;
};

/**
 * Parse CSV file
 */
export const parseCSV = async (file: File): Promise<ParseResult> => {
  return new Promise((resolve) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data: Partial<BloodTestInput> = {};
          const rows = results.data as any[];
          
          if (rows.length === 0) {
            resolve({ success: false, error: 'CSV file is empty' });
            return;
          }
          
          // Get first row to determine structure
          const firstRow = rows[0];
          const headers = Object.keys(firstRow);
          
          // Try to map headers to our fields
          for (const header of headers) {
            const field = findField(header);
            if (field) {
              const value = extractValue(firstRow[header]);
              if (value !== null) {
                data[field] = value;
              }
            }
          }
          
          // If no fields found, try to find values in all rows
          if (Object.keys(data).length === 0) {
            for (const row of rows) {
              for (const [key, value] of Object.entries(row)) {
                const field = findField(key);
                if (field && !data[field]) {
                  const numValue = extractValue(value as string);
                  if (numValue !== null) {
                    data[field] = numValue;
                  }
                }
              }
            }
          }
          
          // Check if we have all required fields
          const requiredFields: (keyof BloodTestInput)[] = ['WBC', 'RBC', 'HGB', 'PLT', 'NEUT', 'LYMPH', 'MONO', 'EO', 'BASO'];
          const missingFields = requiredFields.filter(f => !data[f] || data[f] === 0);
          
          if (missingFields.length > 0) {
            resolve({
              success: false,
              error: `Missing required fields: ${missingFields.join(', ')}. Found fields: ${Object.keys(data).join(', ')}`
            });
            return;
          }
          
          resolve({
            success: true,
            data: data as BloodTestInput
          });
        } catch (error) {
          resolve({
            success: false,
            error: `Error parsing CSV: ${error instanceof Error ? error.message : 'Unknown error'}`
          });
        }
      },
      error: (error) => {
        resolve({
          success: false,
          error: `CSV parsing error: ${error.message}`
        });
      }
    });
  });
};

/**
 * Parse PDF file - extracts text and tries to find blood test values
 */
export const parsePDF = async (file: File): Promise<ParseResult> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }
    
    // Parse the extracted text
    const data: Partial<BloodTestInput> = {};
    const lines = fullText.split('\n');
    
    // Look for field-value pairs in the text
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Try to find a field name
      const field = findField(line);
      if (field && !data[field]) {
        // Try current line first
        let value = extractValue(line);
        
        // If not found, try next line
        if (value === null && i < lines.length - 1) {
          value = extractValue(lines[i + 1]);
        }
        
        if (value !== null) {
          data[field] = value;
        }
      }
      
      // Also try patterns like "WBC: 5.0" or "WBC 5.0"
      const colonMatch = line.match(/(\w+)\s*[:=]\s*([\d.]+)/i);
      if (colonMatch) {
        const [, key, val] = colonMatch;
        const field = findField(key);
        if (field && !data[field]) {
          const value = parseFloat(val);
          if (!isNaN(value)) {
            data[field] = value;
          }
        }
      }
    }
    
    // Check if we have all required fields
    const requiredFields: (keyof BloodTestInput)[] = ['WBC', 'RBC', 'HGB', 'PLT', 'NEUT', 'LYMPH', 'MONO', 'EO', 'BASO'];
    const missingFields = requiredFields.filter(f => !data[f] || data[f] === 0);
    
    if (missingFields.length > 0) {
      return {
        success: false,
        error: `Could not extract all required fields from PDF. Missing: ${missingFields.join(', ')}. Please ensure your PDF contains these blood test values.`
      };
    }
    
    return {
      success: true,
      data: data as BloodTestInput
    };
  } catch (error) {
    return {
      success: false,
      error: `Error parsing PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Parse uploaded file based on type
 */
export const parseFile = async (file: File): Promise<ParseResult> => {
  const fileType = file.type.toLowerCase();
  const fileName = file.name.toLowerCase();
  
  if (fileType === 'text/csv' || fileName.endsWith('.csv')) {
    return await parseCSV(file);
  } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return await parsePDF(file);
  } else if (fileName.endsWith('.csv')) {
    return await parseCSV(file);
  } else if (fileName.endsWith('.pdf')) {
    return await parsePDF(file);
  } else {
    return {
      success: false,
      error: 'Unsupported file type. Please upload a PDF or CSV file.'
    };
  }
};

