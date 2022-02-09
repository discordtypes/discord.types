import {
	GET_GATEWAY_BEARER,
	GET_GATEWAY_BOT,
	OPCodes,
	GatewayIndentifyData,
	GatewayResumeData,
	GatewayPayloadData,
	GatewayDispatchData,
} from '../../discordtypes-api-structures/v9';
import { WebSocket } from 'ws';
import { UnexpectedGatewayException } from '../Exceptions';
import { InvalidTokenException } from '../Exceptions/InvalidTokenException';
import { Client } from './';
import { setTimeout as sleep } from 'node:timers/promises';
import { Handler } from './Handler';
import { UserPresence, UserPresenceStatus } from '../Structures';

export class Gateway {
	/**
	 * The client class
	 * @var Client
	 */
	#client: Client;

	/**
	 * The heartbeat interval
	 * @var number
	 */
	private heartbeat_interval?: number;

	/**
	 * Identifying options
	 * @var GatewayIndentifyData
	 */
	private identifyOptions: Partial<GatewayIndentifyData> = {};

	/**
	 * The last heartbeat event sent to the gateway
	 * @var number
	 */
	private last_heartbeat_ack?: number;

	/**
	 * The last heartbeat received
	 * @var number
	 */
	private last_heartbeat_send?: number;

	/**
	 * The last requests remaining
	 * @var number
	 */
	private requestsRemaining: number = 120;

	/**
	 * When the rate limit is reset
	 * @var number
	 */
	private resetAt?: number = null;

	/**
	 * The las sequence number receive
	 * @var number
	 */
	private sequence?: number;

	/**
	 * The session id found in the Ready event
	 * @var string
	 */
	private session_id?: string;

	/**
	 * The WebSocket client
	 * @var WebSocket
	 */
	public websocket: WebSocket;

	/**
	 * Gateway constructor
	 * @param Client client
	 */
	public constructor(client: Client) {
		this.#client = client;
	}

	/**
	 * Connect the gateway
	 */
	public async connect() {
		if (!this.#client.token)
			throw new InvalidTokenException(
				`Please provide a token to connect the bot.`,
			);

		var req = await this.#client.api.get(
			this.#client.options.authPrefix === 'Bot'
				? GET_GATEWAY_BOT()
				: GET_GATEWAY_BEARER(),
		);

		let url: string;

		if (!req) {
			url = 'wss://gateway.discord.gg';
			this.#client.debug(
				"Cannot get WebSocket by send a request to the api. Use the url stored in cache, it's not advised.",
			);
		} else url = req.url;

		this.initWs(`${url}`);
	}

	/**
	 * Send a hertbeat event to the gateway all the x seconds
	 */
	public heartbeat() {
		this.last_heartbeat_send = Date.now();
		this.send(OPCodes.Heartbeat, this.sequence ? this.sequence : null);
		this.#client.debug('Sending a heartbeat event to the gateway.');
		setTimeout(() => this.heartbeat(), this.heartbeat_interval);
	}

	/**
	 * Idetifying to the gateway
	 */
	public identify() {
		var identify: GatewayIndentifyData = {
			...this.resolveIdentifyOptions(),
			...this.identifyOptions
		}
		identify.presence = this.#client.user ? this.#client.user.resolvePresence() : this.resolveBasePresence();
		this.send(OPCodes.Identify, identify);
		this.#client.debug('Sending gateway identify event');
	}

	/**
	 * Init the websocket
	 * @param string url
	 */
	private initWs(url: string) {
		var websocket = new WebSocket(`${url}/?v=9&encoding=json`);
		websocket.on('open', () => this.onWsOpen());
		websocket.on('message', d => this.onWsMessage(JSON.parse(d)));
		websocket.on('close', (code: number, reason: string) =>
			this.onWsClose(code, reason),
		);
		websocket.on('error', (error: string) => this.onWsError(error));
		this.websocket = websocket;
	}

	/**
	 * If the websocket has received a rate limit
	 * @returns
	 */
	public get limited(): boolean {
		return this.requestsRemaining <= 0;
	}

	/**
	 * OnOpen WebSocket event
	 */
	private onWsOpen() {
		this.#client.debug('WebSocket connection has been etablished.');
	}

	/**
	 * OnMessage WebSocket event
	 * @param GatewayDispatchData d
	 */
	private onWsMessage(datas: GatewayPayloadData) {
		if (datas.s) this.sequence = datas.s;
		switch (datas.op) {
			case OPCodes.Dispatch:
				this.#client.debug(`Receiving ${datas.t} event, handle this...`);
				Handler.handle(this.#client, datas as GatewayDispatchData);
				break;
			case OPCodes.Hello:
				this.#client.debug(
					'Receive the Hello event. Start manage heartbeat and connecting to the gateway.',
				);
				this.identify();
				this.heartbeat_interval = datas.d.heartbeat_interval;
				this.heartbeat();
				break;
			case OPCodes.HeartbeatACK:
				this.last_heartbeat_ack = Date.now();
				this.#client.debug(
					'Receive a gateway heartbeat ACK event. Ping: ' + this.ping + 'ms',
				);
				break;
      case OPCodes.InvalidSession:
        setTimeout(() => this.identify(), 5000);
        break;
		}
	}

	/**
	 * OnClose WebSocket event
	 * @param number code
	 * @param string reason
	 */
	public onWsClose(code: number, reason: string) {
		this.#client.debug(
			`The websocket has closed with ${code} error code for ${reason}. Trying to resume the connection.`,
		);
		this.resume();
	}

	/**
	 * OnError WebSocket event
	 * @param string error
	 */
	public onWsError(error: string) {
		throw new UnexpectedGatewayException(error);
	}

	/**
	 * Get the ping
	 * @var number
	 */
	get ping(): number {
		return this.last_heartbeat_ack - this.last_heartbeat_send;
	}

	/**
	 * Resolve gateway identify options
	 * @returns
	 */
	public resolveIdentifyOptions(): GatewayIndentifyData {
		return {
			token: this.#client.token,
			properties: {
				$os: process.platform,
				$browser: 'Discord.types',
				$device: 'Discord.types',
			},
			intents: this.#client.intents,
		};
	}

	/**
	 * Resolve the base presence
	 * @returns
	 */
	public resolveBasePresence(): UserPresence {
    var basePresence: UserPresence = {
      since: Date.now(),
      activities: [],
      status: UserPresenceStatus.Online
    }
    return basePresence
	}

	/**
	 * Resume the gateway connection when it's close
	 */
	public resume() {
		if (this.session_id && this.sequence) {
			var d: GatewayResumeData = {
				token: this.#client.token,
				session_id: this.session_id,
				seq: this.sequence,
			};
			this.send(OPCodes.Resume, d);
		} else {
			//If the need datas are not set, we trying to reset the websocket connection and retry to connect to this one
			this.heartbeat_interval = null;
			this.last_heartbeat_ack = null;
			this.last_heartbeat_send = null;
			this.sequence = null;
			this.session_id = null;
			this.websocket = null;
			this.connect();
		}
	}

	/**
	 * Send an opcode to the gateway
	 * @param number op
	 * @param Object datas
	 */
	public async send(op: number, datas: Object | string = {}) {
		while (this.limited) {
			console.log(this.resetAt - Date.now());
			await sleep(this.resetAt - Date.now() + 1000);
			this.requestsRemaining = 120;
		}
		if (this.resetAt - Date.now() <= -1 && !this.limited) this.resetAt = null;
		this.requestsRemaining--;
		this.websocket.send(JSON.stringify({ op: op, d: datas }));
		if (this.limited) {
			this.#client.debug(
				`We are now gateway rate limited. All the requests in waiting are sent after 60 seconds.`,
			);
			this.resetAt = Date.now() + 60000;
		}
	}

	/**
	 * Set gateway identify options
	 * @param Partial<GatewayIdentifyData>
	 */
	public setIdentifyOptions(options: Partial<GatewayIndentifyData>): void {
		this.identifyOptions = options;
	}

	/**
	 * Update the client presence
	 */
	public updatePresence(): void {
		this.send(OPCodes.Update_Presence, this.#client.user.presence);
	}
}
