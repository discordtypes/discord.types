import { httpMethods } from ".";
import fetch, { RequestInit, Response } from  'node-fetch';
import { IRouteData } from "@discordtypesmodules/discordtypes-api-structures/v9/IRouteData";
export interface IBucket {
  hashId: string;
  inactive: boolean;

  enqueueRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit)
  runRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit, retries: number): Promise<unknown>;
}