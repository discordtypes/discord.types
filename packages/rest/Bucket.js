"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bucket = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const async_queue_1 = require("@sapphire/async-queue");
const promises_1 = require("node:timers/promises");
const Events_1 = require("./Events");
const RateLimitError_1 = require("./Exceptions/RateLimitError");
const RestError_1 = require("./Exceptions/RestError");
let invalidRequestCount;
let invalidResetTime = null;
class Bucket {
    /**
     * Bucket constructor
     * @param Rest manager
     * @param string hashId
     * @param string majorParameter
     */
    constructor(manager, hashId, majorParameter) {
        this.manager = manager;
        this.hashId = hashId;
        /**
         * If a global rate limit was expected, this is the delay before retrying a request
         * @var number
         */
        this.globalDelay = null;
        /**
         * The number of requests allowed before rate limit
         * @var number
         * @default Infinity
         */
        this.limit = Infinity;
        /**
         * The queue to queue the requests
         * @var AsyncQueue
        */
        this.queue = new async_queue_1.AsyncQueue();
        /**
         * The local remaining request
         * @var number
         * @default 1
         */
        this.remaining = 1;
        /**
         * When, if is there a rate limit, the rate limit is reset
         * @var number
         * @default -1
         */
        this.reset = -1;
        this.id = `${hashId}:${majorParameter}`;
    }
    /**
     * If the bucket is inactive
     * @returns
     */
    get inactive() {
        return this.queue.remaining <= 0 && !this.limited;
    }
    /**
     * If the bucket was limited by a global rate limit
     * @returns
     */
    get globalLimited() {
        return this.manager.globalRemaining <= 0;
    }
    /**
     * If the bucket was limited by a local rate limit
     * @returns
     */
    get localLimited() {
        return this.remaining <= 0 && Date.now() <= this.reset;
    }
    /**
     * If the bucket was limited
     * @returns
     */
    get limited() {
        return this.localLimited || this.globalLimited;
    }
    /**
     * Make a global delay
     * @param number time
     */
    async makeGlobalDelayFor(time) {
        await promises_1.setTimeout(time, undefined, { ref: false });
        this.globalDelay = null;
    }
    /**
     * Make a rate limit debug
     * @param RateLimitData rateLimitData
     * @returns
     */
    makeRateLimit(rateLimitData) {
        this.manager.debug(Events_1.RATE_LIMIT, [
            `The fullroute: ${rateLimitData.fullroute}`,
            `Global ? : ${rateLimitData.global}`,
            `The route hash: ${rateLimitData.hash}`,
            `The request method: ${rateLimitData.method}`,
            `This rate limit is reset after ${rateLimitData.reset_after - Date.now()}`
        ].join('\n'));
        if (this.manager.options.thrownRateLimit)
            throw new RateLimitError_1.RateLimitError('A rate limit was expected, it\'s datas: ' + [
                `The fullroute: ${rateLimitData.fullroute}`,
                `Global ? : ${rateLimitData.global}`,
                `The route hash: ${rateLimitData.hash}`,
                `The request method: ${rateLimitData.method}`,
                `This rate limit is reset after ${rateLimitData.reset_after}`
            ].join('\n'), 429);
    }
    /**
     * Enqueue a request
     * @param string url
     * @param httpMethods method
     * @param RequestInit options
     */
    async enqueueRequest(url, routeId, method, options) {
        let queue = this.queue;
        await queue.wait();
        try {
            return await this.runRequest(url, routeId, method, options);
        }
        finally {
            queue.shift();
        }
    }
    async runRequest(url, routeId, method, options, retries = 0) {
        while (this.limited) {
            var isGlobal = this.globalLimited;
            var timeout;
            var limit;
            var sleepTimeout;
            if (isGlobal) {
                limit = this.manager.options.globalRequetsPerSecond;
                timeout = this.manager.globalReset + this.manager.options.offset - Date.now();
                if (!this.globalDelay)
                    this.manager.globalDelay = this.makeGlobalDelayFor(timeout);
            }
            else {
                limit = this.limit;
                timeout = this.reset - Date.now();
                sleepTimeout = await promises_1.setTimeout(timeout);
            }
            await this.makeRateLimit({
                fullroute: routeId.fullroute,
                global: isGlobal,
                method: method,
                hash: this.hashId,
                reset_after: timeout - Date.now()
            });
            isGlobal ? this.manager.debug(Events_1.DEBUG, `A global rate limit expected. Blocking all requests for ${timeout}ms`) : this.manager.debug(Events_1.DEBUG, `A local rate limit expected, retrying in ${timeout} ms`);
            await sleepTimeout;
        }
        if (!this.manager.globalRemaining || this.manager.globalReset < Date.now()) {
            this.manager.globalReset = Date.now() + 1000;
            this.manager.globalRemaining = this.manager.options.globalRequetsPerSecond;
        }
        this.manager.options.listenRequests ?? this.manager.debug('requests', `A request will be sent. It's datas: ` + [
            `Method: ${method}`,
            `FullUrl: ${url}`,
            `Route: ${routeId.fullroute}`,
            `Retries: ${retries}`
        ]);
        const controller = new AbortController();
        const abortTimeout = setTimeout(() => controller.abort(), this.manager.options.timeout);
        let res;
        try {
            res = await node_fetch_1.default(url, { agent: this.manager.options.httpAgent, signal: controller.signal, ...options });
        }
        catch (e) {
            if (e instanceof Error && e.name === 'AbortError' && retries !== this.manager.options.retries) {
                return await this.runRequest(url, routeId, method, options, retries--);
            }
            throw e;
        }
        finally {
            clearTimeout(abortTimeout);
        }
        this.manager.options.debugRequest ?? this.manager.debug(Events_1.REQUEST, `A request response has just been received. Datas: ${JSON.stringify(res.clone())}`);
        let retryAfter = 0;
        var limit = res.headers.get('X-RateLimit-Limit');
        var remaining = res.headers.get('X-RateLimit-Remaining');
        var reset = res.headers.get('X-RateLimit-Reset-After');
        var hash = res.headers.get('X-RateLimit-Bucket');
        var retry = res.headers.get('Retry-After');
        this.limit = limit ? Number(limit) : Infinity;
        this.remaining = remaining ? Number(remaining) : 1;
        this.reset = reset ? Number(reset) * 1000 + Date.now() + this.manager.options.offset : Date.now();
        if (retry)
            retryAfter = Number(retry) * 1000 + this.manager.options.offset;
        if (hash && this.hashId !== hash) {
            this.manager.hashes.set(`${method}:${hash}`, { hash: hash, lastAccess: Date.now() });
            this.manager.debug(Events_1.DEBUG, `Receive a new hash. Old hash: ${this.hashId} New hash: ${hash}`);
        }
        else if (hash) {
            if (this.manager.hashes.has(hash))
                this.manager.hashes.get(hash).lastAccess = Date.now();
        }
        if (res.status === 401 || res.status === 403 || res.status === 429) {
            if (!invalidResetTime || invalidResetTime < Date.now()) {
                invalidResetTime = Date.now() + 1000 * 60 * 10;
                invalidRequestCount = 0;
            }
            invalidRequestCount++;
        }
        if (this.manager.options.invalidRequestsWarningInterval > 0 && invalidRequestCount % this.manager.options.invalidRequestsWarningInterval === 0) {
            this.manager.debug(Events_1.DEBUG, `Too much invalid requests are submitted. Datas: `, [
                `Count: ${invalidRequestCount}`,
                `Reset: ${invalidResetTime - Date.now()}`
            ]);
        }
        if (res.ok) {
            if (res.headers.get('Content-Type')?.startsWith('application/json'))
                return await res.json();
            else
                return await res.buffer();
        }
        else if (res.status === 429) {
            var isGlobal = this.globalLimited;
            let limit;
            let timeout;
            if (isGlobal) {
                limit = this.manager.options.globalRequetsPerSecond;
                timeout = this.manager.globalReset + this.manager.options.offset - Date.now();
            }
            else {
                limit = this.limit;
                timeout = this.reset;
            }
            this.makeRateLimit({
                fullroute: routeId.fullroute,
                global: isGlobal,
                method: method,
                hash: this.hashId,
                reset_after: timeout
            });
            return await this.runRequest(url, routeId, method, options, retries--);
        }
        else if (res.error >= 500 && res.status < 600) {
            if (retries !== this.manager.options.retries)
                return await this.runRequest(url, routeId, method, options, retries--);
            throw new RestError_1.RestError(`${res.statusText}, ${res.constructor.name}, ${method}, ${url}`);
        }
        else {
            if (res.status >= 400 && res.status < 500) {
                res.status === 401 ?? this.manager.setToken(null);
            }
            throw new RestError_1.RestError(`DiscordAPIError: An unexpected error just happened, response data: ${JSON.stringify(await res.json())}`, 0);
        }
    }
}
exports.Bucket = Bucket;
