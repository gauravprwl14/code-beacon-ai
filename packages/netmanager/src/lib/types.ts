interface BaseResponse {
  status: number;
  isError: boolean;
}


export interface NetManagerResponseData<T> extends BaseResponse {
  data: T;
  error: null | undefined;
  meta?: Record<string, any> | null;


};

export interface NetManagerResponseError extends BaseResponse {
  data: null | undefined;
  error: {
    code: string;
    message: string;
    details?: Record<string, any> | null;
  } | null;
  meta?: Record<string, any> | null;


};



export type NetManagerResponse<T> = NetManagerResponseData<T> | NetManagerResponseError
