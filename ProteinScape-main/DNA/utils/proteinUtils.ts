// Utility functions for protein sequence handling

export const validateSequence = (sequence: string): boolean => {
  if (!sequence || sequence.trim().length === 0) return false;
  const validChars = /^[ACDEFGHIKLMNPQRSTVWYacdefghiklmnpqrstvwy\s]+$/;
  return validChars.test(sequence.replace(/\s/g, ''));
};

export const predictStructure = async (sequence: string): Promise<string | null> => {
  try {
    const cleanSequence = sequence.replace(/\s/g, '').toUpperCase();
    
    const response = await fetch('https://api.esmatlas.com/foldSequence/v1/pdb/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: cleanSequence,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const pdbContent = await response.text();
    return pdbContent;
  } catch (error) {
    console.error('Error predicting structure:', error);
    throw error;
  }
};

export const calculateAminoAcidDistribution = (sequence: string): { aminoAcid: string; count: number }[] => {
  const cleanSequence = sequence.replace(/\s/g, '').toUpperCase();
  const distribution: { [key: string]: number } = {};
  
  for (const char of cleanSequence) {
    if (/[ACDEFGHIKLMNPQRSTVWY]/.test(char)) {
      distribution[char] = (distribution[char] || 0) + 1;
    }
  }
  
  return Object.entries(distribution)
    .map(([aminoAcid, count]) => ({ aminoAcid, count }))
    .sort((a, b) => a.aminoAcid.localeCompare(b.aminoAcid));
};

export const downloadPDB = (pdbContent: string, filename: string = 'predicted_structure.pdb'): void => {
  const blob = new Blob([pdbContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

