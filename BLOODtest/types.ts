export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface AnalysisStep {
  id: number;
  title: string;
  description: string;
  status: 'waiting' | 'processing' | 'completed';
}

export enum SectionId {
  INTRO = 'intro',
  HOW_IT_WORKS = 'how-it-works',
  TECHNOLOGY = 'technology',
  BENEFITS = 'benefits',
  INTEGRATION = 'integration',
  DEMO = 'demo',
}

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