export interface Response {
  content: string;
  intensity: number;
}

export interface OpenRouterResponse {
  id: string;
  choices: {
    message: {
      content: string;
      role: string;
    };
    index: number;
    finish_reason: string;
  }[];
}