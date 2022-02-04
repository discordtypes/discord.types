import { httpMethods } from ".";
import { RequestInit } from 'node-fetch';
import { IRouteData } from "@discordtypesmodules/discordtypes-api-structures/v9/IRouteData";
export interface IBucket {
    hashId: string;
    inactive: boolean;
    enqueueRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit): any;
    runRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit, retries: number): Promise<unknown>;
}
