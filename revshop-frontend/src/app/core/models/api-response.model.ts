// src/app/core/models/api-response.model.ts

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}