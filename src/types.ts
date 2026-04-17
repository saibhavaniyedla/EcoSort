export interface AnalysisResult {
  classification: string;
  confidence: number;
  disposalInstructions: string;
  detectedMaterial: string;
  points: number;
  carbonOffset: string;
  binType: 'recyclable' | 'dry' | 'wet';
}

export type View = 'Home' | 'Scanner' | 'Game' | 'AI Chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: string;
  bullets?: string[];
}

export interface Tip {
  id: string;
  title: string;
  time: string;
  icon: string;
}

export interface WasteItem {
  id: string;
  name: string;
  type: string;
  image: string;
  bin: 'dry' | 'wet' | 'recyclable';
}
