/// <reference types="node" />
import EventEmitter from "./EventEmiter";
import { Agent, Agent as httpAgent, AgentOptions as httpAgentOptions } from 'node:http';
import { Agent as httpsAgent } from 'node:https';
import { RequestInit } from 'node-fetch';
import { RouteLike } from "@discordtypesmodules/discordtypes-api-structures/v9";
import { IBucket } from "./IBucket";
/**
 * Events type for debug
 */
export declare type EventsLike = 'rate_limit' | 'requests' | 'unknow' | 'sweep' | 'debug';
/**
 * The http methods
 */
export declare type httpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'get' | 'post' | 'put' | 'patch' | 'delete';
/**
 * The http agent options
 */
export declare type httpAgentName = 'http' | 'https';
/**
 * File raw interface
 */
export interface RawFile {
    /**
     * The name of the file
     * @var string
     */
    name: string;
    /**
     * Use for the formdata of this file.
     * When not provided, the index of the file in the files array is used in the form `files[${index}]`.
       * If you wish to alter the placeholder snowflake, you must provide this property in the same form (`files[${placeholder}]`)
    @var number;
    */
    key?: number;
    /**
     * The file content
     */
    content: string | number | boolean | Buffer;
}
/**
 * The Hash data
 */
export interface HashData {
    /**
     * Hash name
     * @var string
     */
    hash: string;
    /**
     * Timestamp of when the bucket has been accessed
     * @var number
     */
    lastAccess: number;
}
/** The header used for requests strcuture require */
export interface RequestHeaders {
    /**
     * Authorization field to access to the api, in the discord api it's called "the token"
     * @var string
     */
    Authorization?: string;
    /**
     * User-Agent header field
     * @var string
     */
    'User-Agent': string;
    /**
     *  X-Audit-Log-Reason header field
     * @var string
     */
    'X-Audit-Log-Reason'?: string;
}
/**
 * The RouteData interface
 * used for send a request
 */
export interface RouteData {
    /**@var httpMethods */
    method: httpMethods;
    /**
     *  major route used for buckets id
     * @var RouteLike
     */
    majorRoute: string;
    /**
     * Route options
     * @var httpAgentOptions|httpsAgentOptions
     */
    options?: Agent;
}
/**
 * When 429 error code is expected
 */
export interface RateLimit {
    /**
     * The fullroute used to send the request
     * @var RouteLike
     */
    fullroute: RouteLike;
    /**
     * If the rate limit is global or not
     * @var number
     */
    global: boolean;
    /**
     * The route hash used when the request was send.
     * @var string
     */
    hash: string;
    /**
     * The method used to send the request
     * @var httpMethods
     * @default 'get'
     */
    method: httpMethods;
    /**
     *  When the rate limit is reset
     * @var number
     */
    reset_after: number;
}
/**
 * The RateLimitData interface
 * https://discord.com/developers/docs/topics/rate-limits
 */
export interface RateLimitData {
    /**
     * All the requests the client can made before the rate limit reset
     * @var number
     */
    limit: number;
    /**
     * All remaining requests the client can made before rate limit reset
     * @var number
     */
    request_remaining: number;
    /**
     * Reset timestamp
     * @var number
    */
    reset: number;
    /**
     * The rate limit is reset after, in seconds
     * @var number
    */
    reset_after: number;
    /**
     * The rate limit scope
     * @var string
     */
    scope?: string;
}
interface RestOptions {
    /**
     * The api url
     * @var string
     * @default https://discord.com/api/
     */
    api: string;
    /**
     * The prefix of the token
     * If the client is a bot, use Bot else use Bearer
     * @var string
     * @default 'Bot'
     */
    authPrefix?: 'Bot' | 'Bearer';
    /**
     * After this time, all hashes are cleared
     * @var number
     * @default 14_400_000
     */
    clearHashesTime: number;
    /**
     * If it's set to true, the requests are debuging
     * @var boolean
     * @default true
     */
    debugRequest?: boolean;
    /**
     * Additional headers to send to in the request
     * @var Record
     * @default {}
     */
    headers: Record<string, string>;
    /**
     * The number of warnings in a 60 minutes window between window emitted warnings
     * @var number
     * @default 0
     */
    invalidRequestsWarningInterval: number;
    /**
     * The number of global requests allowed per second
     * @var number
     * @default 50
     */
    globalRequetsPerSecond: number;
    /**
     * The http agent
     * @var httpAgent|httpAgents
     * @default httpsAgent
     */
    httpAgent: Omit<httpAgentOptions, 'keepAlive'>;
    /**
     * Time to handle the sweepers
     * @var number
     * @default 3_600_00
     */
    handleSweepers: number;
    /**
     * The life time of a hash
     * @var number
     * @default 86_400_00
     */
    hashLifeTime: number;
    /**
     * The time to sweep the hash
     * @var number
     * @default 3_600_000
     */
    hashSweepInterval: number;
    /**
     * The options for the http agent
     * @var httpAgentOptions
     * @default {}
     */
    httpAgentOptions?: Omit<httpAgentOptions, 'keepAlive'>;
    /**
     * If it's true, all the requests are debugging before send
     * @var boolean
     * @default true
     */
    listenRequests: boolean;
    /**
     * An offset to add to the rate limits in milliseconds
     * @default 50
     */
    offset?: number;
    /**
     * Amount of retries when a request failed
     * @var number
     * @default 5
     */
    retries?: number;
    /**
     * The timeout to send a request
     * @var number
     * @default 5000
     */
    timeout: number;
    /**
     * If we must thrown rate limit error when a rate limit expected
     * @var boolean
     * @default true
     */
    thrownRateLimit?: boolean;
    /**
     * The authorization token needs to access to the api
     * @var string
     */
    token?: string;
    /**
     * The User-Agent to append in the header
     * @var string
     */
    userAgentToAppend?: string;
    /**
     * The api version to use into the fullurl if versionned field is on true
     * @var number
     * @default 9
     */
    version: number;
}
/**
 * Request data
 */
export interface RequestData {
    /**
     * Method to send the request
     * @var httpMethods
    */
    method: httpMethods;
    /**
     * The fullroute string
     * @var string
     */
    fullroute: RouteLike;
    /**
     * The request options
     * @var RequestOptions
     */
    options?: RequestOptions;
}
/**
 * Request Options
 */
export interface RequestOptions {
    /**
     * If it's true, the body will be append to form data
     * @var boolean
     */
    appendToFormData?: boolean;
    /**
     * If this request must have an Authorization field with the token in the header
     * @var boolean
     */
    auth?: boolean;
    /**
     * The request body
     * @var any
     */
    body?: any;
    /**
     * The request files
     * @var any[]
     */
    files?: RawFile[] | undefined;
    /**
     * Additional headers
     * @var {}
     */
    headers?: Record<string, string>;
    /**
     * The request query to include to the full url
     * @var string
     */
    query?: string;
    /**
     * The X-Audit-Log-Reason field in the header
     * @var string
     */
    reason?: string;
    /**
     * If the request must be versionned
     * @var boolean
     */
    versionned?: boolean;
}
export interface ResolveRequestData {
    /**
     * The solved url
     * @var string
     */
    url: string;
    /**
     * The solved options
     * @var RequestInit
     */
    options: RequestInit;
}
export declare class Rest extends EventEmitter<{
    debug: any;
}> {
    #private;
    /**
     * All buckets
     * @var Map
     */
    buckets: Map<string, IBucket>;
    /**
     * The bucket timer
     * @var any
     */
    bucketTimer?: any;
    /**
     * The global delay when a ratelimit is expected
     * @var Promise<any>
     */
    globalDelay: Promise<any>;
    /**
     * The time to reset a global rate limit
     * @var number
     * @default -1
     */
    globalReset: number;
    /**
     * The global remaining requests in the global bucket
     * @var number
     * @default 50
     */
    globalRemaining: number;
    /**
     * Buckets hashes
     * @var Map<string, HashData>
     */
    hashes: Map<string, HashData>;
    /**
     * The hash timer
     * @var any
     */
    hashTimer?: any;
    /**
     * The Rest options
     * @var RestOptions
     */
    options: RestOptions;
    /**
     * Rest Constructor
     * @param RestOptions options
     */
    constructor(options?: Partial<RestOptions>);
    /**
     * Setuping seepers
    * @returns void
    */
    setupSweepers(): void;
    /**
     * Clear the hash sweep timer
     * @returns
     */
    clearHashTimer(): void;
    /**
     * Clear the bucket sweep timer
     * @returns
     */
    clearBucketTimer(): void;
    /**
     * Resolve the default values for RestOptions
     * @returns
     */
    resolveDefaultOptions(): Required<RestOptions>;
    /**
     * Set the http agent
     * @param httpAgentName                                      agent
     * @param httpAgentOptions|httpsAgentOptions    opt
     */
    setAgent(agent: httpAgentName | httpAgent | httpsAgent, opt?: Omit<httpAgentOptions, 'keepAlive'>): void;
    /**
     * Set the token
     * @param string token
     * @returns
     */
    setToken(token: string): void;
    /**
     * Debugging and send a event to the REST
     * ```ts
     * REST.on('debug', async(type, datas) => {
     *  console.log(`Receive a debug event: ${type}: ${datas}`)
     * });```
     * @param EventLike type
     * @param any[]         args
     */
    debug(type?: EventsLike, ...args: any[]): void;
    /**
     * Resolve header user agent
     * @returns
     */
    resolveUserAgent(): string;
    /**
     * Resolve a request
     * @param RequestData req
     * @returns
     */
    resolveRequest(req: RequestData): ResolveRequestData;
    /**
     * Get a Bucket Hash
     * @param string hashId
     * @returns
     */
    getHash(hashId: string): HashData;
    /**
     * Get a Bucket
     * @param string id
     * @returns
     */
    getBucket(id: string, majorParameter: string): IBucket;
    /**
     * Create a bucket
     * @param string id
     * @returns
     */
    createBucket(id: string, majorParameter: string): IBucket;
    /**
     * Send a request
     * @param RequestData data
     * @returns
     */
    request(data: RequestData): Promise<any>;
    /**
     * Execute a get method
     * @param RouteLike route
     * @param Omit<RequestOptions, 'body'> options
     * @param any body
     */
    get(route: RouteLike, options?: Omit<RequestOptions, 'body'>, body?: any): Promise<any>;
    /**
     * Execute a post method
     * @param RouteLike route
     * @param any body
     * @param Omit<RequestOptions, 'body'> options
     */
    post(route: RouteLike, body?: any, options?: Omit<RequestOptions, 'body'>): Promise<any>;
    /**
    * Execute a put method
    * @param RouteLike route
    * @param any body
    * @param Omit<RequestOptions, 'body'> options
    */
    put(route: RouteLike, body?: any, options?: Omit<RequestOptions, 'body'>): Promise<any>;
    /**
   * Execute a patch method
   * @param RouteLike route
   * @param any body
   * @param Omit<RequestOptions, 'body'> options
   */
    patch(route: RouteLike, body?: any, options?: Omit<RequestOptions, 'body'>): Promise<any>;
    /**
   * Execute a delete method
   * @param RouteLike route
   * @param RequestOptions options
   */
    delete(route: RouteLike, options?: RequestOptions): Promise<any>;
}
export {};
