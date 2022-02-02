import EventEmitter from "./EventEmiter";
import {Agent, Agent as httpAgent, AgentOptions as httpAgentOptions} from 'node:http';
import {Agent as httpsAgent, AgentOptions as httpsAgentOptions} from 'node:http';
import FormData from 'form-data';
import * as Routes from '../typescord-api-structures/v9/';
import * as Methods from './Utils/Methods';
import { Bucket } from "./Bucket";
import { BASE_API_VERSION, BASE_URL, RouteLike } from "../typescord-api-structures/v9/";
import { TokenException } from "./Exceptions/TokenException";

/**
 * Events type for debug
 */
export type EventsLike = 'rate_limit'|'requests'|'unknow';

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
   */
  api?: string;
  /**
   * The prefix of the token
   * If the client is a bot, use Bot else use Bearer
   * @var string
   */
  authPrefix?: 'Bot'|'Bearer';
  /**
   * If it's set to true, the requests are debuging
   * @var boolean
   */
  debugRequest?: boolean;
  /**
   * The http agent
   * @var httpAgent|httpAgents
   */
  httpAgent?: Omit<httpAgentOptions, 'keepAlive'>;
  /**
   * The authorization token needs to access to the api
   * @var string
   */
  token?: string;
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
   * @var any
   */
  options?: RequestOptions;
}

/**
 * Request Options
 */
export interface RequestOptions {
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
   * The options for the http agent
   * @var httpAgentOptions
   */
  httpAgentOptions?: Omit<httpAgentOptions, 'keepAlive'>;
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
   * The User-Agent to append in the header
   * @var string
   */
  userAgentToAppend?: string;
  /**
   * The api version to use into the fullurl if versionned field is on true
   * @var number
   */
  version?: number;
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
  options: RequestInit
}

export class Rest extends EventEmitter<{
  //Used for debuging
  debug,
}>{

  /**
   * The http agent
   * @var httpAgent|httpsAgent|null
   */
  public agent?: httpAgent|httpsAgent = null;

  /**
   * All buckets
   * @var Map
   */
  public buckets: Map<string, Bucket>;

  /** 
   * Buckets hashes
   * @var Map<string, HashData>
   */
  public hashes: Map<string, HashData>;

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
  public constructor(options: RestOptions){
    super();
    this.#token = options.authPrefix ? options.authPrefix + options.token : `Bot ${options.token}`;
    this.buckets = new Map<string, Bucket>();
    this.hashes = new Map<string, HashData>();
    this.options = options;
    if(!options.api) this.options.api = BASE_URL();
  }

  /**
   * Set the http agent
   * @param httpAgentName                                      agent
   * @param httpAgentOptions|httpsAgentOptions    opt
   */
  public setAgent(agent: httpAgentName|httpAgent|httpsAgent, opt: httpAgentOptions|httpsAgentOptions): void{
    typeof this.agent  == 'string' ? agent === 'https' ? this.agent = new httpAgent({...opt, keepAlive: true}) : this.agent = new httpsAgent({...opt, keepAlive: true}) : this.agent = agent as Agent
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

  !options.httpAgent ?? options.api.startsWith('https') ? this.options.httpAgent = new httpsAgent({keepAlive: true, ...req.options.httpAgentOptions})  : this.options.httpAgent = new httpAgent({keepAlive: true, ...req.options.httpAgentOptions})

   let query = '';

   if(req.options.query){
      var solvedQuery = req.options.query.toString()
      if(solvedQuery !== query) query = solvedQuery
    }

    var fullUrl = options.api + (req.options.versionned !==  false) ? `/v${req.options.version ? req.options.version : BASE_API_VERSION()}` : '' + req.fullroute + query;

    var headers: RequestHeaders  = {
      ...req.options.headers,
      'User-Agent': `${this.resolveUserAgent()} ${req.options.userAgentToAppend}`.trim()
    }

    if(req.options.auth !== false){
      if(this.#token) headers.Authorization = this.#token
      else throw new TokenException('Please provide a token with setToken function to use requests that need token')
    }

    if(req.options.reason?.length){
      headers['X-Audit-Log-Reason'] = req.options.reason
    }

    var RequestInit: RequestInit['body'];
    var additionalHeaders: Record<string, string> = {}

    if(req.options.files?.length){
      const formData = new FormData() as any
      for(const [index, file] of req.options.files.entries()){
        formData.append(file.key ?? `files[${index}]`, file.content, file.name);
      }
    }
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
  public getBucket(id: string): Bucket {
    return this.buckets.has(id) ? this.buckets.get(id) : this.createBucket(id);
  }

  /**
   * Create a bucket
   * @param string id
   * @returns
   */
  public createBucket(id: string): Bucket{
    var bucket = new Bucket();
    !this.buckets.has(id) ?? this.buckets.set(id, bucket);
    return bucket;
  }

  /**
   * Send a request
   * @param RequestData data
   * @returns
   */
  public async request(data: RequestData){
    var {method, fullroute, options} = data
    var routeId = Routes.resolveRouteData(fullroute);
    
    //Get or create the hash to get a bucket
    var hash: HashData = this.getHash(`${method}:${routeId.bucketRoute}`) ?? {
      hash: `Global(${method}:${routeId.bucketRoute})`,
      lastAccess: Date.now()
    };
    //Create a bucket with the hash
    var bucket = this.getBucket(hash.hash)

  }
}

