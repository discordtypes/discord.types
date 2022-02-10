import { EventEmitter, Rest, RestOptions } from '@discordtypesmodules/rest';
import { Gateway } from '.';
import { GuildManager } from '../Managers';
import { ClientUser } from '../Structures';
import { Intents } from '../Utils';

export interface ClientOptions {
	/**
	 * If the client is a bot, use 'Bot', else, use 'Bearer'
	 * @var string
	 * @default 'Bot'
	 */
	authPrefix?: string;
	/**
	 * The client intents
	 * https://discord.com/developers/docs/topics/gateway#gateway-intents
	 * @var number[]|bigint[]
	 */
	intents: number[] | bigint[];
	/**
	 * The rest options
	 * @var string
	 */
	restOptions: Partial<RestOptions>;
	/**
	 * The client token
	 * @var string
	 */
	token?: string | undefined;
}

export class Client extends EventEmitter<{
	// Used to debugging
	debug;

	//When a guild is created
	guildCreate;

	//The ready event
	ready;
}> {
	/**
	 * The Rest class used to send all the requests to the Discord Rest API
	 * @var Rest
	 */
	public api: Rest;

	/**
	 * The guild manager
	 * @var GuildManager
	 */
	public guilds: GuildManager;

	/**
	 * The solved intents
	 * @var number
	 */
	public intents: number;

	/**
	 * The client options
	 * @var ClientOptions
	 */
	public options: ClientOptions;

	/**
	 * The client token. Used to connect the client to the gateway & the Rest.
	 * @var string
	 */
	public token?: string | undefined;

	/**
	 * The client user class, set when the ready event was received
	 * @var ClientUser
	 */
	public user?: ClientUser;

	/**
	 * The Gateway class used to receive and send Discord OP Codes
	 * @var Gateway
	 */
	public ws: Gateway;

	/**
	 * Client constructor
	 * @param ClientOptions options
	 */
	public constructor(options: Partial<ClientOptions> = {}) {
		super();

		//initializing basics options
		this.options = { ...this.resolveClientOptions(), ...options };
		this.token = this.options.token
			? `${this.options.authPrefix} ${this.options.token}`
			: undefined;
		this.api = options.token ? new Rest({ token: this.token }) : new Rest();
		this.ws = new Gateway(this);
		this.intents = Intents.resolveIntents(this.options.intents);

		//initializing all the managers
		this.guilds = new GuildManager(this);
	}

	/**
	 * Used to debugging
	 * @var string message
	 * @var any[] args
	 */
	public debug(message: string, ...args) {
		this.emit('debug', message, ...args);
	}

	/**
	 * Login the bot to the gateway and the Rest API
	 * @param string token
	 */
	public login(token: string) {
		this.token = `${this.options.authPrefix} ${token}`;
		this.api.setToken(token);
		this.ws.connect();
	}
	/**
	 * Resolve base client options
	 * @returns
	 */
	public resolveClientOptions(): Required<ClientOptions> {
		return {
			authPrefix: 'Bot',
			intents: [32765],
			restOptions: {},
			token: undefined,
		};
	}
}
