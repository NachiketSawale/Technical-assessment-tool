
export interface Option {
  id: number;
  optionText: string;
  questionId: number; // optional, from backend
}

export interface Question {
  id: number;
  questionText: string;
  options: Option[]; // optional, because backend sometimes returns null
  correctAnswer?: number; // store Option.id instead of full object
  isLive?: boolean;
  isMultipleAnswer: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  submittedCount: number;
  skippedCount: number;
  timeTaken: number;
}

export interface Answer {
  questionId: number;
  selectedOptionIds: number[];
}

export interface SubmitQuizPayload {
  answers: Answer[];
  timeTaken: number;
}