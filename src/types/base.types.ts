export interface BaseResponse<T> {
  data: T[];
  status_code: number;
  status: string;
  message: string;
}

export interface BaseField {
  id: number;
  uid: string;
  created_at: Date;
  updated_at: Date;
}
