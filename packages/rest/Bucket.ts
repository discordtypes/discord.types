import fetch, { RequestInit, Response } from 'node-fetch';
import { httpMethods, RateLimit, RateLimitData, Rest, RouteData } from ".";
import { AsyncQueue } from '@sapphire/async-queue';
import { setTimeout as sleep } from 'node:timers/promises';
import { IBucket } from "./IBucket";
import {DEBUG, RATE_LIMIT, REQUEST} from './Events';
import { RouteLike } from '@discordtypesmodules/discordtypes-api-structures/v9';
import { RateLimitError } from './Exceptions/RateLimitError';
import { IRouteData } from '@discordtypesmodules/discordtypes-api-structures/v9/IRouteData';
import { RestError } from './Exceptions/RestError';


let invalidRequestCount: number;
let invalidResetTime: number = null;
export class Bucket implements IBucket {

  /**
   * The hash id
   * @var string
   */
  private readonly id: string;

  /**
   * If a global rate limit was expected, this is the delay before retrying a request
   * @var number
   */
  private globalDelay?: number = null;

  /**
   * The number of requests allowed before rate limit
   * @var number
   * @default Infinity
   */
  private limit: number = Infinity;

  /**
   * The queue to queue the requests
   * @var AsyncQueue 
  */
 private queue: AsyncQueue = new AsyncQueue();

 /**
  * The local remaining request
  * @var number
  * @default 1
  */
 private remaining: number = 1;

 /**
  * When, if is there a rate limit, the rate limit is reset
  * @var number
  * @default -1
  */
 private reset: number = -1;

 /**
  * Bucket constructor
  * @param Rest manager
  * @param string hashId
  * @param string majorParameter
  */

  public constructor(private readonly manager: Rest, public readonly hashId, majorParameter: string){
    this.id = `${hashId}:${majorParameter}`
  }

  /**
   * If the bucket is inactive
   * @returns
   */
  public get inactive(): boolean {
    return this.queue.remaining <= 0 && !this.limited;
  }

  /**
   * If the bucket was limited by a global rate limit
   * @returns
   */
  public get globalLimited(): boolean {
    return this.manager.globalRemaining <= 0;
  }

  /**
   * If the bucket was limited by a local rate limit
   * @returns
   */
  public get localLimited(): boolean {
    return this.remaining <= 0 && Date.now() <= this.reset;
  }

  /**
   * If the bucket was limited
   * @returns
   */
  public get limited(): boolean {
    return this.localLimited || this.globalLimited;
  }

  /**
   * Make a global delay
   * @param number time
   */
  public async makeGlobalDelayFor(time: number){
    await sleep(time, undefined, {ref: false})
    this.globalDelay = null;
  }

  /**
   * Make a rate limit debug
   * @param RateLimitData rateLimitData
   * @returns
   */
  public makeRateLimit(rateLimitData: RateLimit){
    this.manager.debug(RATE_LIMIT, [
      `The fullroute: ${rateLimitData.fullroute}`,
      `Global ? : ${rateLimitData.global}`,
      `The route hash: ${rateLimitData.hash}`,
      `The request method: ${rateLimitData.method}`,
      `This rate limit is reset after ${rateLimitData.reset_after - Date.now()}`
    ].join('\n'))

    if(this.manager.options.thrownRateLimit) throw new RateLimitError('A rate limit was expected, it\'s datas: ' + [
      `The fullroute: ${rateLimitData.fullroute}`,
      `Global ? : ${rateLimitData.global}`,
      `The route hash: ${rateLimitData.hash}`,
      `The request method: ${rateLimitData.method}`,
      `This rate limit is reset after ${rateLimitData.reset_after}`
    ].join('\n'), 429)
  }


  /**
   * Enqueue a request
   * @param string url
   * @param httpMethods method
   * @param RequestInit options
   */
  public async enqueueRequest(url: string, routeId: IRouteData, method: httpMethods, options: RequestInit) {
    let queue: AsyncQueue = this.queue;

    await queue.wait();

    try {
      return await this.runRequest(url, routeId, method, options);
    }finally {
      queue.shift();
    }
  }

  public async runRequest(url: string, routeId: IRouteData,  method: httpMethods, options: RequestInit, retries: number = 0): Promise<unknown>{
    while(this.limited){
      var isGlobal = this.globalLimited;
      var timeout: number;
      var limit: number;
      var sleepTimeout;

      if(isGlobal){
        limit = this.manager.options.globalRequetsPerSecond;
        timeout = this.manager.globalReset + this.manager.options.offset - Date.now();
        if(!this.globalDelay) this.manager.globalDelay = this.makeGlobalDelayFor(timeout);
      }else {
        limit = this.limit
        timeout = this.reset - Date.now()
        sleepTimeout = await sleep(timeout)
      }
      await this.makeRateLimit({
        fullroute: routeId.fullroute,
        global: isGlobal,
        method: method,
        hash: this.hashId,
        reset_after: timeout - Date.now()
      })

      isGlobal ? this.manager.debug(DEBUG, `A global rate limit expected. Blocking all requests for ${timeout}ms`) : this.manager.debug(DEBUG, `A local rate limit expected, retrying in ${timeout} ms`);
      await sleepTimeout;
    }

    if(!this.manager.globalRemaining || this.manager.globalReset < Date.now()){
      this.manager.globalReset = Date.now()+1000;
      this.manager.globalRemaining = this.manager.options.globalRequetsPerSecond;
    }

    this.manager.options.listenRequests ?? this.manager.debug('requests', `A request will be sent. It's datas: ` + [
      `Method: ${method}`,
      `FullUrl: ${url}`,
      `Route: ${routeId.fullroute}`,
      `Retries: ${retries}`
    ])
    
    const controller = new AbortController()
    const abortTimeout = setTimeout(() => controller.abort(), this.manager.options.timeout)
    let res: Response;
    try {
      res = await fetch(url, {agent: this.manager.options.httpAgent, signal: controller.signal as any, ...options}) 
    }catch(e){
      if(e instanceof Error && e.name === 'AbortError' && retries !== this.manager.options.retries){
        return await this.runRequest(url, routeId, method, options, retries--);
      }
      throw e;
    }finally{
      clearTimeout(abortTimeout)
    }

    this.manager.options.debugRequest ?? this.manager.debug(REQUEST, `A request response has just been received. Datas: ${JSON.stringify(res.clone())}`)
    let retryAfter = 0;

    var limit = res.headers.get('X-RateLimit-Limit')
    var remaining = res.headers.get('X-RateLimit-Remaining')
    var reset = res.headers.get('X-RateLimit-Reset-After')
    var hash = res.headers.get('X-RateLimit-Bucket')
    var retry = res.headers.get('Retry-After')

    this.limit = limit ? Number(limit) : Infinity;
    this.remaining = remaining ? Number(remaining) : 1;
    this.reset = reset ? Number(reset) * 1000 + Date.now() + this.manager.options.offset : Date.now()
    
    if(retry) retryAfter = Number(retry) * 1000 + this.manager.options.offset

    if(hash && this.hashId !== hash){
      this.manager.hashes.set(`${method}:${hash}`, {hash: hash, lastAccess: Date.now()})
      this.manager.debug(DEBUG, `Receive a new hash. Old hash: ${this.hashId} New hash: ${hash}`)
    }else if(hash){
      if(this.manager.hashes.has(hash)) this.manager.hashes.get(hash).lastAccess = Date.now()
    }
  
    if(res.status === 401 || res.status === 403 || res.status === 429){
       if(!invalidResetTime || invalidResetTime < Date.now()){
        invalidResetTime = Date.now() + 1000*60*10;
        invalidRequestCount = 0;
      }
      invalidRequestCount++;
    }

    if(this.manager.options.invalidRequestsWarningInterval > 0 && invalidRequestCount%this.manager.options.invalidRequestsWarningInterval === 0){
      this.manager.debug(DEBUG, `Too much invalid requests are submitted. Datas: `, [
        `Count: ${invalidRequestCount}`,
        `Reset: ${invalidResetTime - Date.now()}`
      ]);
    }

      if(res.ok){
        if(res.headers.get('Content-Type')?.startsWith('application/json')) return await res.json(); else return await res.buffer(); 
      }else if(res.status === 429){
        var isGlobal = this.globalLimited;
        let limit: number;
        let timeout: number;

        if(isGlobal){
          limit = this.manager.options.globalRequetsPerSecond
          timeout = this.manager.globalReset + this.manager.options.offset - Date.now()
        }else {
          limit = this.limit
          timeout = this.reset
        }
        this.makeRateLimit({
          fullroute: routeId.fullroute,
          global: isGlobal,
          method: method,
          hash: this.hashId,
          reset_after: timeout
        })
        return await this.runRequest(url, routeId, method, options, retries--)
      }else if(res.error >= 500 && res.status < 600){
        if(retries !== this.manager.options.retries) return await this.runRequest(url, routeId, method, options, retries--)

        throw new RestError(`${res.statusText}, ${res.constructor.name}, ${method}, ${url}`);
      }else {
        if(res.status >= 400 && res.status < 500){
        res.status === 401 ?? this.manager.setToken(null)
      }
      throw new RestError(`DiscordAPIError: An unexpected error just happened, response data: ${JSON.stringify(await res.json())}`, 0)
    }
  }
}