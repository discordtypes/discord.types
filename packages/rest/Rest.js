"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _token;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rest = void 0;
const EventEmiter_1 = __importDefault(require("./EventEmiter"));
const node_http_1 = require("node:http");
const node_https_1 = require("node:https");
const form_data_1 = __importDefault(require("form-data"));
const Routes = __importStar(require("@discordtypesmodules/discordtypes-api-structures/v9"));
const Methods = __importStar(require("./Utils/Methods"));
const Bucket_1 = require("./Bucket");
const v9_1 = require("@discordtypesmodules/discordtypes-api-structures/v9");
const TokenException_1 = require("./Exceptions/TokenException");
const RestError_1 = require("./Exceptions/RestError");
const Events_1 = require("./Events");
class Rest extends EventEmiter_1.default {
    /**
     * Rest Constructor
     * @param RestOptions options
     */
    constructor(options = {}) {
        super();
        /**
         * The global delay when a ratelimit is expected
         * @var Promise<any>
         */
        this.globalDelay = null;
        /**
         * The time to reset a global rate limit
         * @var number
         * @default -1
         */
        this.globalReset = -1;
        /**
         * The authorization token needs to access to the api
         * @var string
         */
        _token.set(this, void 0);
        this.buckets = new Map();
        this.hashes = new Map();
        this.options = { ...this.resolveDefaultOptions(), ...options };
        __classPrivateFieldSet(this, _token, `${this.options.authPrefix} ${options.token}`);
        this.globalRemaining = this.options.globalRequetsPerSecond;
        this.setupSweepers();
    }
    /**
     * Setuping seepers
    * @returns void
    */
    setupSweepers() {
        const { options } = this;
        const checkTime = (time) => {
            if (time > 14400000) {
                throw new RestError_1.RestError('Cannot set time over 4 hours.');
            }
        };
        if (options.clearHashesTime > 1 && options.clearHashesTime !== Infinity) {
            checkTime(options.hashSweepInterval);
            this.hashTimer = setTimeout(() => {
                for (var [k, v] of this.hashes) {
                    if (v.lastAccess > 1) {
                        if (Math.floor(Date.now() - v.lastAccess) > this.options.hashLifeTime) {
                            this.hashes.delete(k);
                            this.debug(Events_1.SWEEP, `Hash delete because it hasn't been used before ${Date.now() - v.lastAccess} seconds. Hash: ${k}, value: ${v.hash}, lastAccess: ${v.lastAccess}`);
                        }
                    }
                }
            }, options.hashSweepInterval).unref();
            if (options.handleSweepers > 1 && options.handleSweepers !== Infinity) {
                checkTime(options.handleSweepers);
                this.bucketTimer = setTimeout(() => {
                    for (var [k, v] of this.buckets) {
                        if (v.inactive) {
                            this.buckets.delete(k);
                            this.debug(Events_1.SWEEP, `Bucket delete because it's inactive. BucketID: ${v.hashId}.`);
                        }
                    }
                }, options.handleSweepers).unref();
            }
        }
    }
    /**
     * Clear the hash sweep timer
     * @returns
     */
    clearHashTimer() {
        this.hashTimer ?? clearTimeout(this.hashTimer);
    }
    /**
     * Clear the bucket sweep timer
     * @returns
     */
    clearBucketTimer() {
        this.bucketTimer ?? clearTimeout(this.bucketTimer);
    }
    /**
     * Resolve the default values for RestOptions
     * @returns
     */
    resolveDefaultOptions() {
        return {
            api: v9_1.BASE_URL(),
            authPrefix: 'Bot',
            clearHashesTime: 14000000,
            debugRequest: true,
            globalRequetsPerSecond: 50,
            handleSweepers: 3600000,
            hashLifeTime: 86400000,
            hashSweepInterval: 3600000,
            headers: {},
            httpAgent: new node_https_1.Agent({ keepAlive: true }),
            httpAgentOptions: {},
            listenRequests: true,
            offset: 50,
            invalidRequestsWarningInterval: 500,
            retries: 5,
            token: undefined,
            timeout: 5000,
            thrownRateLimit: true,
            userAgentToAppend: '',
            version: v9_1.BASE_API_VERSION(),
        };
    }
    /**
     * Set the http agent
     * @param httpAgentName                                      agent
     * @param httpAgentOptions|httpsAgentOptions    opt
     */
    setAgent(agent, opt = {}) {
        typeof this.options.httpAgent == 'string' ? agent === 'https' ? this.options.httpAgent = new node_http_1.Agent({ ...opt, keepAlive: true }) : this.options.httpAgent = new node_https_1.Agent({ ...opt, keepAlive: true }) : this.options.httpAgent = agent;
    }
    /**
     * Set the token
     * @param string token
     * @returns
     */
    setToken(token) {
        __classPrivateFieldSet(this, _token, `${this.options.authPrefix} ${token}`);
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
    debug(type = 'unknow', ...args) {
        type === 'requests' ? this.options.debugRequest ?? this.emit('debug', type, args) : this.emit('debug', type, args);
    }
    /**
     * Resolve header user agent
     * @returns
     */
    resolveUserAgent() {
        return 'DiscordBot(https://github.com/discordtypes/discord.types) ';
    }
    /**
     * Resolve a request
     * @param RequestData req
     * @returns
     */
    resolveRequest(req) {
        var { options } = this;
        if (options.httpAgent) {
            if (options.httpAgent instanceof node_http_1.Agent && options.api.startsWith('https')) {
                this.options.httpAgent = new node_https_1.Agent({ keepAlive: true, ...options.httpAgentOptions });
            }
        }
        else {
            this.options.httpAgent = new node_https_1.Agent({ keepAlive: true, ...options.httpAgentOptions });
        }
        let query = '';
        if (!req.options)
            req.options = {};
        if (req.options.query) {
            var solvedQuery = req.options.query.toString();
            if (solvedQuery !== query)
                query = solvedQuery;
        }
        var v = req.options.versionned !== false ? `/v${options.version}` : '';
        var fullUrl = `${options.api}${v}${req.fullroute}${query}`;
        var headers = {
            ...req.options.headers,
            'User-Agent': `${this.resolveUserAgent()} ${options.userAgentToAppend}`.trim()
        };
        if (req.options.auth !== false) {
            if (__classPrivateFieldGet(this, _token))
                headers.Authorization = __classPrivateFieldGet(this, _token);
            else
                throw new TokenException_1.TokenException('Please provide a token with setToken function to use requests that need token');
        }
        if (req.options.reason?.length) {
            headers['X-Audit-Log-Reason'] = req.options.reason;
        }
        var finalBody;
        var additionalHeaders = {};
        if (req.options.files?.length) {
            const formData = new form_data_1.default();
            for (const [index, file] of req.options.files.entries()) {
                formData.append(file.key ?? `files[${index}]`, file.content, file.name);
            }
            if (req.options.body !== null) {
                if (req.options.appendToFormData === true) {
                    for (const [k, v] of Object.entries(req.options.body)) {
                        formData.append(k, v);
                    }
                }
                else {
                    formData.append('payload_json', JSON.stringify(req.options.body));
                }
                finalBody = formData;
                additionalHeaders = formData.getHeaders();
            }
        }
        else if (req.options.body !== null) {
            finalBody = JSON.stringify(req.options.body);
            additionalHeaders = { 'Content-Type': 'application/json' };
        }
        return { url: fullUrl, options: {
                agent: this.options.httpAgent,
                body: finalBody,
                headers: { ...headers, ...options.headers ?? {}, ...additionalHeaders },
                method: req.method
            } };
    }
    /**
     * Get a Bucket Hash
     * @param string hashId
     * @returns
     */
    getHash(hashId) {
        return this.hashes.get(hashId);
    }
    /**
     * Get a Bucket
     * @param string id
     * @returns
     */
    getBucket(id, majorParameter) {
        return this.buckets.has(id) ? this.buckets.get(id) : this.createBucket(id, majorParameter);
    }
    /**
     * Create a bucket
     * @param string id
     * @returns
     */
    createBucket(id, majorParameter) {
        var bucket = new Bucket_1.Bucket(this, id, majorParameter);
        !this.buckets.has(id) ?? this.buckets.set(id, bucket);
        return bucket;
    }
    /**
     * Send a request
     * @param RequestData data
     * @returns
     */
    async request(data) {
        var { method, fullroute } = data;
        var routeId = Routes.resolveRouteData(fullroute);
        //Get or create the hash to get a bucket
        var hash = this.getHash(`${method}:${routeId.bucketRoute}`) ?? {
            hash: `Global(${method}:${routeId.bucketRoute})`,
            lastAccess: Date.now()
        };
        //Create a bucket with the hash
        var bucket = this.getBucket(hash.hash, routeId.majorParameter);
        const { url, options } = this.resolveRequest(data);
        return bucket.enqueueRequest(url, routeId, method, options);
    }
    /**
     * Execute a get method
     * @param RouteLike route
     * @param Omit<RequestOptions, 'body'> options
     * @param any body
     */
    async get(route, options = {}, body = null) {
        return await this.request({ fullroute: route, options: { ...options, ...body }, method: Methods.GET });
    }
    /**
     * Execute a post method
     * @param RouteLike route
     * @param any body
     * @param Omit<RequestOptions, 'body'> options
     */
    async post(route, body = null, options = {}) {
        if (body instanceof Object)
            body = JSON.parse(body);
        return await this.request({ fullroute: route, options: { ...options, ...body }, method: Methods.POST });
    }
    /**
    * Execute a put method
    * @param RouteLike route
    * @param any body
    * @param Omit<RequestOptions, 'body'> options
    */
    async put(route, body = null, options = {}) {
        if (body instanceof Object)
            body = JSON.parse(body);
        return await this.request({ fullroute: route, options: { ...options, ...body }, method: Methods.PUT });
    }
    /**
   * Execute a patch method
   * @param RouteLike route
   * @param any body
   * @param Omit<RequestOptions, 'body'> options
   */
    async patch(route, body = null, options = {}) {
        if (body instanceof Object)
            body = JSON.parse(body);
        return await this.request({ fullroute: route, options: { ...options, ...body }, method: Methods.PATCH });
    }
    /**
   * Execute a delete method
   * @param RouteLike route
   * @param RequestOptions options
   */
    async delete(route, options = {}) {
        return await this.request({ fullroute: route, options: { ...options }, method: Methods.DELETE });
    }
}
exports.Rest = Rest;
_token = new WeakMap();
