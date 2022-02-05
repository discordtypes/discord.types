import { httpMethods } from ".";
import fetch, { RequestInit, Response } from  'node-fetch';
export interface IBucket {
  hashId: string;
  inactive: boolean;

  enqueueRequest(url: string, method: httpMethods, options: RequestInit)
  runRequest(url: string, method: httpMethods, options: RequestInit): Promise<unknown>;
}