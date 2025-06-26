export interface Feedback {
  id: string;
  mechanicId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface createFeedbackInput {
  mechanicId: string;
  userId: string;
  rating: number;
  comment: string;
}