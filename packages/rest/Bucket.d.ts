import { RequestInit } from 'node-fetch';
import { httpMethods, RateLimit, Rest } from ".";
import { IBucket } from "./IBucket";
import { IRouteData } from '@discordtypesmodules/discordtypes-api-structures/v9/IRouteData';
export declare class Bucket implements IBucket {
    private readonly manager;
    readonly hashId: any;
    /**
     * The hash id
     * @var string
     */
    private readonly id;
    /**
     * If a global rate limit was expected, this is the delay before retrying a request
     * @var number
     */
    private globalDelay?;
    /**
     * The number of requests allowed before rate limit
     * @var number
     * @default Infinity
     */
    private limit;
    /**
     * The queue to queue the requests
     * @var AsyncQueue
    */
    private queue;
    /**
     * The local remaining request
     * @var number
     * @default 1
     */
    private remaining;
    /**
     * When, if is there a rate limit, the rate limit is reset
     * @var number
     * @default -1
     */
    private reset;
    /**
     * Bucket constructor
     * @param Rest manager
     * @param string hashId
     * @param string majorParameter
     */
    constructor(manager: Rest, hashId: any, majorParameter: string);
    /**
     * If the bucket is inactive
     * @returns
     */
    get inactive(): boolean;
    /**
     * If the bucket was limited by a global rate limit
     * @returns
     */
    get globalLimited(): boolean;
    /**
     * If the bucket was limited by a local rate limit
     * @returns
     */
    get localLimited(): boolean;
    /**
     * If the bucket was limited
     * @returns
     */
    get limited(): boolean;
    /**
     * Make a global delay
     * @param number time
     */
    makeGlobalDelayFor(time: number): Promise<void>;
    /**
     * Make a rate limit debug
     * @param RateLimitData rateLimitData
     * @returns
     */
    makeRateLimit(rateLimitData: RateLimit): void;
    /**
     * Enqueue a request
     * @param string url
     * @param httpMethods method
     * @param RequestInit options
     */
    enqueueRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit): Promise<unknown>;
    runRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit, retries?: number): Promise<unknown>;
}
