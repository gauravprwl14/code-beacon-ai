import { APIError } from "./apiError";

export interface ErrorDetails {
  [key: string]: any;
}


// export type NetManagerError = {
//   error: {
//     code: string;
//     message: string;
//     details?: ErrorDetails | null;
//   };
// };


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
  // error: {
  //   code: string;
  //   message: string;
  //   details?: Record<string, any> | null;
  // } | null;
  error: APIError | null;
  meta?: Record<string, any> | null;


};



export type NetManagerResponse<T> = NetManagerResponseData<T> | NetManagerResponseError
