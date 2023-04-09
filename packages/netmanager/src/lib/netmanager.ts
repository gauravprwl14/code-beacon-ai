
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as z from 'zod';
import { NetManagerResponse } from './types'
import { includes } from "../utils/helpers";


// TODO
// testing of the netmanager service
// adding the default error check ( bad gateway, 500, network interface error)
// using httpstatus lib to manage the error handling
// default error msg config


// Define response schema using zod
const responseSchema = z.object({
  data: z.any(),
  error: z.object({
    code: z.number(),
    message: z.string(),
    details: z.any().optional()
  }),
  meta: z.any().optional()
});

// Define request options schema using zod
const requestOptionsSchema = z.object({
  url: z.string(),
  method: z.string(),
  headers: z.record(z.string()),
  data: z.any().optional(),
});

// Define default config for axios
const defaultConfig: AxiosRequestConfig = {
  baseURL: process.env.REACT_APP_BACKEND_URL || '',
  timeout: 10000,
};




class NetManager {
  private axiosInstance = axios.create(defaultConfig);

  public async request<T>(options: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
    try {
      const validatedOptions = requestOptionsSchema.parse(options);

      // Default headers
      const headers = {
        Accept: '*/*',
        'Content-Type': 'application/json',
      };

      // Adding body index iff
      if (includes(['POST', 'PUT', 'PATCH', 'DELETE'], options.method)) {

        options.data = JSON.stringify(options.data);
      }

      // Combining headers
      options.headers = {
        ...headers,
        ...options.headers,
      };


      const response = await this.axiosInstance.request<AxiosResponse>(
        validatedOptions
      );

      return this.handleSuccessResponse(response);

    } catch (error: any) {
      console.error('error inside the netManager', { error })
      return this.handleErrorResponse(error);
      // throw new Error(`Request failed: ${error.message}`);
    }
  }

  private handleSuccessResponse = (
    response: AxiosResponse
  ) => {
    const data = response.data;
    const meta = response?.data?.meta || null;
    return {

      data: data,
      status: response.status,
      error: null,
      isError: false,
      meta: meta
    };
  };

  private handleErrorResponse = (error: any) => {
    const errorResponse = {
      data: null,
      status: 500,
      isError: true,
      error: {
        code: '',
        message: '',
        details: null,
      },
      meta: null,
    };

    if (axios.isAxiosError(error)) {
      const response = error.response;
      if (response) {
        errorResponse.status = response.status;
        errorResponse.error.code = response.data?.code || '';
        errorResponse.error.message = response.data?.message || '';
        errorResponse.error.details = response.data?.details || null;
      } else {
        errorResponse.error.message = error.message || '';
      }
    } else {
      errorResponse.status = 500;
      errorResponse.error.message = error.message || 'Something Went Wrong';
      errorResponse.error.code = error.code || '500';
    }

    return errorResponse;
  };





  // async get<T>(url: string, config?: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
  //   const response = await this.axiosInstance.get<T>(url, config);
  //   return { data: response.data, meta: response.data.meta };
  // }

  // async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
  //   const response = await this.axiosInstance.post<T>(url, data, config);
  //   return { data: response.data, meta: response.data.meta };
  // }

  // async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
  //   const response = await this.axiosInstance.put<T>(url, data, config);
  //   return { data: response.data, meta: response.data.meta };
  // }

  // async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
  //   const response = await this.axiosInstance.patch<T>(url, data, config);
  //   return { data: response.data, meta: response.data.meta };
  // }

  // async delete<T>(url: string, config?: AxiosRequestConfig): Promise<NetManagerResponse<T>> {
  //   const response = await this.axiosInstance.delete<T>(url, config);
  //   return { data: response.data, meta: response.data.meta };
  // }


}

export default new NetManager();






