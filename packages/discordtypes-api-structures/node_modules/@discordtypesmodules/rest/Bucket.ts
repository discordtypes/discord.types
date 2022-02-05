import fetch, { RequestInit, Response } from 'node-fetch';
import { httpMethods, Rest } from ".";
import { AsyncQueue } from '@sapphire/async-queue';
import { setTimeout as sleep } from 'node:timers/promises';
import { IBucket } from "./IBucket";

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
    return this.remaining <= 0;
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
   * @returns
   */
  public async makeGlobalDelayFor(time: number){
    await sleep(time, undefined, {ref: false})
    this.globalDelay = null;
  }

  /**
   * Enqueue a request
   * @param string url
   * @param httpMethods method
   * @param RequestInit options
   */
  public async enqueueRequest(url: string, method: httpMethods, options: RequestInit) {
    let queue: AsyncQueue = this.queue;

    await queue.wait();

    try {
      return await this.runRequest(url, method, options);
    }finally {
      queue.shift();
    }
  }

  public async runRequest(url: string, method: httpMethods, options: RequestInit): Promise<unknown>{
    var controller = new AbortController();
    console.log(url)
    setTimeout(() => controller.abort, this.manager.options.timeout)
    return fetch(url, {...options, agent: options.httpAgent, signal: controller.signal as any})
  }
}