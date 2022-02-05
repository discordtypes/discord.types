import { Snowflake } from '@discordtypesmodules/discordtypes-api-structures/v9';
import { CDNError } from './Exceptions/CDNError';

export const AllowedImageExtensions = ['png', 'jpeg', 'webp', 'gif'];

/**
 * An enum with all extensions
 */
export enum ImageExtensions {
	webp = 'webp',
	png = 'png',
	jpeg = 'jpeg',
	gif = 'gif',
}

/**
 * All the extensions allowed to make an url
 */
export type ExtensionsLike = keyof typeof ImageExtensions;

/**
 * All the image size allowed
 */
export type ImageSize = 16 | 23 | 64 | 128 | 512 | 1024 | 2048 | 4096;

/**
 * The CDN options
 */
interface CDNOptions {
	/**
	 * The base url to create an url
	 * @var string
	 * @default 'https://cdn.discord.com''
	 */
	baseUrl?: string;
}

/**
 * The base image url options
 */
interface BaseImageUrlOptions {
	/**
	 * The extension of the image
	 * @var string
	 * @default webp
	 */
	extension?: string;
	/**
	 * The size of the image
	 * @var ImageSize
	 */
	size?: ImageSize;
}

/**
 * The url options used to make an image url
 */
interface ImageURLOptions extends BaseImageUrlOptions {
	/**
	 * If the image must be static or not
	 * @var boolean
	 */
	forceStatic?: boolean;
}

/**
 * The options used when we make a cdn url
 */
interface MakeURLOptions {
	/**
	 * All the allowed extensions
	 * @var ImageExtensions
	 */
	allowedExtensions?: ReadonlyArray<string>;
	/**
	 * The extension for the image
	 * @var string
	 * @default webp;
	 */
	extension?: string;
	/**
	 * The size of the image
	 * @var ImageSize
	 */
	size?: ImageSize;
}

export class CDN {
	/**
	 * The CDN options
	 * @var CDNOptions
	 */
	public options?: CDNOptions;

	public constructor(options?: Partial<CDNOptions>) {
		this.options = { ...this.resolveCDNOptions(), ...options };
	}

	/**
	 * Resolve the cdn options
	 * @returns
	 */
	public resolveCDNOptions(): Required<CDNOptions> {
		return {
			baseUrl: 'https://cdn.discordapp.com',
		};
	}

	/**
	 * Get an application asset
	 * @param Snowflake applicationId
	 * @param Snowflake assetId
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public applicationAsset(
		applicationId: Snowflake,
		assetId: Snowflake,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/app-assets/${applicationId}/${assetId}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get an application cover
	 * @param Snowflake applicationId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public applicationCover(
		applicationId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/app-icons/${applicationId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get an application icon
	 * @param Snowflake applicationId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public applicationIcon(
		applicationId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/app-icons/${applicationId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get a custom emoji
	 * @param Snowflake emojiId
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public customEmoji(
		emojiId: Snowflake,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/emojis/${emojiId}`, options);
	}

	/**
	 * Get a default avatar user url
	 * @param string|number userDiscriminator
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public defaultUserAvatarUrl(
		userDiscriminator: string | number,
		options: BaseImageUrlOptions = {},
	): string {
		var userDiscriminatorModulo =
			typeof userDiscriminator === 'string'
				? parseInt(userDiscriminator, 10) % 5
				: userDiscriminator % 5;
		return this.makeURL(`/embed/avatars/${userDiscriminatorModulo}`, {
			allowedExtensions: ['png'],
			...options,
		});
	}

	/**
	 * Get a guild banner
	 * @param Snowflake guildId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public guildBanner(
		guildId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/banners/${guildId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get a guild discovery splash
	 * @param Snowflake guildId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public guidDiscoverySplash(
		guildId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/discovery-splashes/${guildId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get a guild icon
	 * @param Snowflake guildId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public guildIcon(
		guildId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.dynamicURL(`/icons/${guildId}/${hash}`, hash, options);
	}

	/**
	 * Get a guild member avatar
	 * @param Snowflake guildId
	 * @param Snowflake userId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public guildMemberAvatar(
		guildId: Snowflake,
		userId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.dynamicURL(
			`/guilds/${guildId}/users/${userId}/avatars/${hash}`,
			hash,
			options,
		);
	}

	/**
	 * Get a guild scheduled event cover
	 * @param Snowflake scheduledEventId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public getGuildScheduledEventCover(
		scheduledEventId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/guild-events/${scheduledEventId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get a guild splash
	 * @param Snowflake guildId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public guildSplash(
		guildId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/splashes/${guildId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
			...options,
		});
	}

	/**
	 * Get a role icon
	 * @param Snowflake roleId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public roleIcon(
		roleId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/role-icons/${roleId}/${hash}`, {
			allowedExtensions: ['png', 'jpeg', 'webp'],
		});
	}

	/**
	 * Get a sticker
	 * @param Snowflake stickerId
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public sticker(
		stickerId: Snowflake,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/stickers/${stickerId}`, {
			allowedExtensions: ['png', 'lottie'],
			...options,
		});
	}

	/**
	 * Get a sticker pack banner
	 * @param Snowflake stickerPackId
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public stickerPackBanner(
		stickerPackId: Snowflake,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(
			`/app-assets/710982414301790216/store/${stickerPackId}`,
			{ allowedExtensions: ['png', 'jpeg', 'webp'] },
		);
	}

	/**
	 * Get a team icon
	 * @param Snowflake teamId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public teamIcon(
		teamId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.makeURL(`/team-icons/${teamId}/${hash}`);
	}

	/**
	 * Get a user avatar
	 * @param Snowflake userId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public userAvatar(
		userId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.dynamicURL(`/avatars/${userId}/${hash}`, hash, options);
	}

	/**
	 * Get a user banner
	 * @param Snowflake userId
	 * @param string hash
	 * @param BaseImageUrlOptions options
	 * @returns
	 */
	public userBanner(
		userId: Snowflake,
		hash: string,
		options: BaseImageUrlOptions = {},
	): string {
		return this.dynamicURL(`/banners/${userId}/${hash}`, hash, options);
	}

	/**
	 * Determine if an image hash is animate and return it's url
	 * @param string route
	 * @param string hash
	 * @param forceStatic boolean
	 * @param options ImageURLOptions
	 * @returns
	 */
	public dynamicURL(
		route: string,
		hash: string,
		{ forceStatic = false, ...options }: ImageURLOptions = {},
	): string {
		return this.makeURL(
			route,
			!forceStatic && hash.startsWith('a_')
				? { ...options, extension: 'gif' }
				: options,
		);
	}

	/**
	 * Make the image url with the options passed in parameters
	 * @param string route
	 * @param AllowedImageExtensions allowedExtensions
	 * @param string extension
	 * @param size
	 * @returns
	 */
	public makeURL(
		route: string,
		{
			allowedExtensions = AllowedImageExtensions,
			extension = 'webp',
			size,
		}: MakeURLOptions = {},
	): string {
		extension = String(extension).toLowerCase();

		if (!allowedExtensions.includes(extension))
			throw new CDNError(`Extension ${extension} not allowed`, 0);

		var url = new URL(`${this.options.baseUrl}${route}.${extension}`);
		if (size) url.searchParams.set('size', String(size));

		return url.toString();
	}
}
