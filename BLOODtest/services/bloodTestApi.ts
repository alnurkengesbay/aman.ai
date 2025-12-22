export interface BloodTestInput {
  WBC: number;
  RBC: number;
  HGB: number;
  PLT: number;
  NEUT: number;
  LYMPH: number;
  MONO: number;
  EO: number;
  BASO: number;
}

export interface BloodTestResult {
  success: boolean;
  disease: string;
  cause: string;
  result_code: number;
  input_values: BloodTestInput;
}

export interface BloodTestError {
  error: string;
}

const API_BASE_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000';

export const analyzeBloodTest = async (input: BloodTestInput): Promise<BloodTestResult> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData: BloodTestError = await response.json();
      throw new Error(errorData.error || 'Failed to analyze blood test');
    }

    const result: BloodTestResult = await response.json();
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error: Could not connect to analysis server');
  }
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
};

