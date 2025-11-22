export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string; // Markdown content
  author: string;
  date: string;
  imageUrl: string;
  tags: string[];
  readTime: number;
  impact: 'positive' | 'negative' | 'neutral' | 'mixed';
}

export interface AnalysisData {
  year: number;
  digital: number;
  physical: number;
}

export enum ViewState {
  HOME = 'HOME',
  ARTICLE = 'ARTICLE',
  ABOUT = 'ABOUT',
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
  SAVED = 'SAVED'
}