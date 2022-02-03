import EventEmitter from "./EventEmiter";
import {Agent, Agent as httpAgent, AgentOptions as httpAgentOptions} from 'node:http';
import {Agent as httpsAgent, AgentOptions as httpsAgentOptions} from 'node:http';
import FormData from 'form-data';
import * as Routes from '../typescord-api-structures/v9/';
import * as Methods from './Utils/Methods';
import { RequestInit } from 'node-fetch';
import { Bucket } from "./Bucket";
import { BASE_API_VERSION, BASE_URL, RouteLike } from "../typescord-api-structures/v9/";
import { TokenException } from "./Exceptions/TokenException";
import { IBucket } from "./IBucket";
import { RestError } from "./Exceptions/RestError";
import { SWEEP } from "./Events";

/**
 * Events type for debug
 */
export type EventsLike = 'rate_limit'|'requests'|'unknow'|'sweep';

/**
 * The http methods
 */
export type httpMethods = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'|'get'|'post'|'put'|'patch'|'delete';

/**
 * The http agent options
 */
export type httpAgentName = 'http'|'https'; 

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
 content: string|number|boolean|Buffer;
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
   * If the rate limit is global or not
   * @var number
   */
  global?: boolean;

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
  scope: string;
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
  authPrefix?: 'Bot'|'Bearer';
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
  headers: Record<string, string>
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
   * The timeout to send a request
   * @var number
   * @default 5000
   */
  timeout: number;
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

//The resolve request data, used for resolve a request by RequestData
export interface ResolveRequestData {
  /**
   * The solved url
   * @var string
   */
  url: string,
  /**
   * The solved options
   * @var RequestInit
   */
  options: RequestInit;
}

export class Rest extends EventEmitter<{
  //Used for debuging
  debug,
}>{

  /**
   * All buckets
   * @var Map
   */
  public buckets: Map<string, IBucket>;

  /**
   * The bucket timer
   * @var any
   */
  public bucketTimer?: any;

  /**
   * The global remaining requests in the global bucket
   * @var number
   * @default 50
   */
  public globalRemaining: number;

  /** 
   * Buckets hashes
   * @var Map<string, HashData>
   */
  public hashes: Map<string, HashData>;

  /**
   * The hash timer
   * @var any
   */
  public hashTimer?: any;

  /**
   * The Rest options
   * @var RestOptions
   */
  public options: RestOptions;

  /**
   * The authorization token needs to access to the api
   * @var string
   */
  #token: string;

  /**
   * Rest Constructor
   * @param RestOptions options
   */
  public constructor(options: Partial<RestOptions>){
    super();
    this.buckets = new Map<string, IBucket>();
    this.hashes = new Map<string, HashData>();
    this.options = {...this.resolveDefaultOptions(), ...options};
    this.#token = options.token ?? options.authPrefix  ? options.authPrefix + options.token : `Bot ${options.token}`;
    this.globalRemaining = this.options.globalRequetsPerSecond;
  }

  /**
   * Setuping seepers
  * @returns void
  */
  public setupSweepers(): void {
    const {options} = this;
    const checkTime = (time) => {
      if(time > 14_400_000){
        throw new RestError('Cannot set time over 4 hours.');
      }
    }

    if(options.clearHashesTime > 1 && options.clearHashesTime !== Infinity){
      checkTime(options.hashSweepInterval)
      this.hashTimer = setTimeout(() => {
         for (var [k, v] of this.hashes){
          if(v.lastAccess > 1) {
            if(Math.floor(Date.now() - v.lastAccess) > this.options.hashLifeTime){
              this.hashes.delete(k)
              this.debug(SWEEP, `Hash delete because it hasn't been used before ${Date.now() - v.lastAccess} seconds. Hash: ${k}, value: ${v.hash}, lastAccess: ${v.lastAccess}`)
            }
          }
         }
      }, options.hashSweepInterval);
      if(options.handleSweepers > 1 && options.handleSweepers !== Infinity){
        checkTime(options.handleSweepers)
        this.bucketTimer = setTimeout(() => {
          for(var [k, v] of this.buckets){
            if(v.inactive){
              this.buckets.delete(k)
              this.debug(SWEEP, `Bucket delete because it's inactive. BucketID: ${v.hashId}.`)
            }
          }
        }, options.handleSweepers)
      }
    }
  }

/**
 * Clear the hash sweep timer 
 * @returns
 */
public clearHashTimer(): void {
  this.hashTimer ?? clearTimeout(this.hashTimer)
}

  /**
   * Clear the bucket sweep timer
   * @returns
   */
  public clearBucketTimer(): void {
    this.bucketTimer ?? clearTimeout(this.bucketTimer)
  }

  /**
   * Resolve the default values for RestOptions
   * @returns
   */
  public resolveDefaultOptions(): Required<RestOptions> {
    return {
      api: BASE_URL(),
      authPrefix: 'Bot',
      clearHashesTime: 14_000_000,
      debugRequest: true,
      globalRequetsPerSecond: 50,
      handleSweepers: 3_600_000,
      hashLifeTime: 86_400_000,
      hashSweepInterval: 3_600_000,
      headers: {},
      httpAgent: new httpsAgent({keepAlive: true}),
      httpAgentOptions: {},
      invalidRequestsWarningInterval: 500,
      token: undefined,
      timeout: 5000,
      userAgentToAppend: '',
      version: BASE_API_VERSION(),
    }
  }

  /**
   * Set the http agent
   * @param httpAgentName                                      agent
   * @param httpAgentOptions|httpsAgentOptions    opt
   */
  public setAgent(agent: httpAgentName|httpAgent|httpsAgent, opt: Omit<httpAgentOptions, 'keepAlive'>): void{
    typeof this.options.httpAgent  == 'string' ? agent === 'https' ? this.options.httpAgent = new httpAgent({...opt, keepAlive: true}) : this.options.httpAgent = new httpsAgent({...opt, keepAlive: true}) : this.options.httpAgent = agent as Agent
  }

  /**
   * Set the token
   * @param string token
   * @returns
   */
  public setToken(token: string){
    this.#token = `${this.options.authPrefix} ${token}`  
  }

  /**
   * Debugging and send a event to the REST
   * ```ts
   * REST.on('debug', async(type, datas) => {
   *  console.log(`Receive a debug event: ${type}: ${datas}`)
   * });```
   * @param EventLike type
   * @param any[]         args
   */
  public debug(type: EventsLike = 'unknow', ...args): void{
   type === 'requests' ? this.options.debugRequest ?? this.emit('debug', type, args) : this.emit('debug', type, args);
  }

  /**
   * Resolve header user agent
   * @returns
   */
  public resolveUserAgent(): string {
    return 'DiscordBot(https://github.com/discordtypes/discord.types) ';
  }

  /**
   * Resolve a request
   * @param RequestData req 
   * @returns 
   */
  public resolveRequest(req: RequestData): ResolveRequestData{
   var {options} = this;

  !options.httpAgent ?? options.api.startsWith('https') ? this.options.httpAgent = new httpsAgent({keepAlive: true, ...this.options.httpAgentOptions})  : this.options.httpAgent = new httpAgent({keepAlive: true, ...this.options.httpAgentOptions})

   let query = '';

   if(!req.options) req.options = {}

   if(req.options.query){
      var solvedQuery = req.options.query.toString()
      if(solvedQuery !== query) query = solvedQuery
    }
    var v = req.options.versionned !== false ? `/v${options.version}` : ''
    var fullUrl = `${options.api}${v}${req.fullroute}${query}`;

    var headers: RequestHeaders  = {
      ...req.options.headers,
      'User-Agent': `${this.resolveUserAgent()} ${options.userAgentToAppend}`.trim()
    }

    if(req.options.auth !== false){
      if(this.#token) headers.Authorization = this.#token
      else throw new TokenException('Please provide a token with setToken function to use requests that need token')
    }

    if(req.options.reason?.length){
      headers['X-Audit-Log-Reason'] = req.options.reason
    }

    var finalBody: RequestInit['body'];
    var additionalHeaders: Record<string, string> = {}

    if(req.options.files?.length){
      const formData = new FormData() as any
      for(const [index, file] of req.options.files.entries()){
        formData.append(file.key ?? `files[${index}]`, file.content, file.name);
      }
      if(req.options.body !== null){
        if(req.options.appendToFormData === true){
          for(const [k, v] of Object.entries(req.options.body as Record<any, any>)){
            formData.append(k, v);
          }
        }else {
          formData.append('payload_json', JSON.stringify(req.options.body));
        }
        finalBody = formData
        additionalHeaders = formData.getHeaders();
      }
    }else if(req.options.body !== null){
      finalBody = JSON.stringify(req.options.body);
      additionalHeaders = {'Content-Type': 'application/json'}
    }

    return {url: fullUrl, options: {
      agent: this.options.httpAgent,
      body: finalBody,
      headers: {...headers, ...options.headers ?? {}, ...additionalHeaders},
      method: req.method
    }}
  }

  /**
   * Get a Bucket Hash
   * @param string hashId
   * @returns
   */
  public getHash(hashId: string): HashData {
    return this.hashes.get(hashId);
  }

  /**
   * Get a Bucket
   * @param string id
   * @returns
   */
  public getBucket(id: string, majorParameter: string): IBucket {
    return this.buckets.has(id) ? this.buckets.get(id) : this.createBucket(id, majorParameter);
  }

  /**
   * Create a bucket
   * @param string id
   * @returns
   */
  public createBucket(id: string, majorParameter: string): IBucket{
    var bucket = new Bucket(this, id, majorParameter);
    !this.buckets.has(id) ?? this.buckets.set(id, bucket);
    return bucket;
  }

  /**
   * Send a request
   * @param RequestData data
   * @returns
   */
  public async request(data: RequestData){
    var {method, fullroute} = data
    var routeId = Routes.resolveRouteData(fullroute);
    
    //Get or create the hash to get a bucket
    var hash: HashData = this.getHash(`${method}:${routeId.bucketRoute}`) ?? {
      hash: `Global(${method}:${routeId.bucketRoute})`,
      lastAccess: Date.now()
    };
    //Create a bucket with the hash
    var bucket = this.getBucket(hash.hash, routeId.majorParameter)

    const {url, options} = this.resolveRequest(data)
    return bucket.enqueueRequest(url, method, options);
  }
}

