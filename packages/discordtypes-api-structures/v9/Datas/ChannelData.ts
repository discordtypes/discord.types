import { UserData } from '.';
import { Snowflake } from '..';

export interface ChannelData {
	/**
	 * the id of this channel
	 * @var Snowflake
	 */
	id: Snowflake;
	/**
	 * the type of channel
	 * @var number
	 */
	type: number;
	/**
	 * the id of the guild (may be missing for some channel objects received over gateway guild dispatches)
	 * @var Snowflake
	 */
	guild_id?: Snowflake;
	/**
	 * sorting position of the channel
	 * @var number
	 */
	position?: number;
	/**
	 * explicit permission overwrites for members and roles
	 * @var ChannelOverwrite[]
	 */
	permission_overwrites?: ChannelOverwrite[];
	/**
	 * the name of the channel (1-100 characters)
	 * @var string
	 */
	name?: string;
	/**
	 * the channel topic (0-1024 characters)
	 * @var string
	 */
	topic?: string | null;
	/**
	 * whether the channel is nsfw
	 * @var boolean
	 */
	nsfw?: boolean;
	/**
	 * 	the id of the last message sent in this channel (may not point to an existing or valid message)
	 * @var Snowflake
	 */
	last_message_id?: Snowflake | null;
	/**
	 * the bitrate (in bits) of the voice channel
	 * @var number
	 */
	bitrate?: number;
	/**
	 * the user limit of the voice channel
	 */
	user_limit?: number;
	/**
	 * amount of seconds a user has to wait before sending another message (0-21600); bots, as well as users with the
	 * permission manage_messages or manage_channel, are unaffected
	 * @var number
	 */
	rate_limit_per_user?: number;
	/**
	 * the recipients of the DM
	 * @var UserData[]
	 */
	recipients?: UserData[];
	/**
	 * icon hash of the group DM
	 * @var string
	 */
	icon?: string | null;
	/**
	 * id of the creator of the group DM or thread
	 * @var Snowflake
	 */
	owner_id?: Snowflake;
	/**
	 * application id of the group DM creator if it is bot-created
	 * @var Snowflake
	 */
	application_id?: Snowflake;
	/**
	 * 	for guild channels: id of the parent category for a channel (each parent category can contain up to 50
	 * channels), for threads: id of the text channel this thread was created
	 * @var Snowflake
	 */
	parent_id?: Snowflake | null;
	/**
	 * when the last pinned message was pinned. This may be null in events such as GUILD_CREATE when a message is not
	 * pinned.
	 * @var number
	 */
	last_pin_timestamp?: number;
	/**
	 * voice region id for the voice channel, automatic when set to null
	 * @var string
	 */
	rtc_region?: string | null;
	/**
	 * the camera video quality mode of the voice channel, 1 when not present
	 * @var number
	 */
	video_quality_mode?: number;
	/**
	 * an approximate count of messages in a thread, stops counting at 50
	 * @var number
	 */
	message_count?: number;
	/**
	 * an approximate count of users in a thread, stops counting at 50
	 * @var number
	 */
	member_count?: number;
	/**
	 * thread-specific fields not needed by other channels
	 * @var ThreadMetadata
	 */
	thread_metadata?: ThreadMetadata;
	/**
	 * thread member object for the current user, if they have joined the thread, only included on certain API
	 * endpoints
	 * @var ThreadMember
	 */
	member?: ThreadMember;
	/**
	 * 	default duration that the clients (not the API) will use for newly created threads, in minutes, to
	 * automatically archive the thread after recent activity, can be set to: 60, 1440, 4320, 10080
	 * @var number
	 */
	default_auto_archive_duration?: number;
	/**
	 * computed permissions for the invoking user in the channel, including overwrites, only included when part of
	 * the resolved data received on a slash command interaction
	 * @var string
	 */
	permissions?: string;
}

export enum ChannelTypes {
	/**
	 * a text channel within a server
	 */
	'GUILD_TEXT' = 0,
	/**
	 * a direct message between users
	 */
	'DM' = 1,
	/**
	 * a voice channel within a server
	 */
	'GUILD_VOICE' = 2,
	/**
	 * a direct message between multiple users
	 */
	'GROUP_DM' = 3,
	/**
	 * an organizational category that contains up to 50 channels
	 */
	'GUILD_CATEGORY' = 4,
	/**
	 * a channel that users can follow and crosspost into their own server
	 */
	'GUILD_NEWS' = 5,
	/**
	 * a channel in which game developers can sell their game on Discord
	 */
	'GUILD_STORE' = 6,
	/**
	 * a temporary sub-channel within a GUILD_NEWS channel
	 */
	'GUILD_NEWS_THREAD' = 10,
	/**
	 * a temporary sub-channel within a GUILD_TEXT channel
	 */
	'GUILD_PUBLIC_THREAD' = 11,
	/**
	 * 	a temporary sub-channel within a GUILD_TEXT channel that is only viewable by those invited and those with the
	 * MANAGE_THREADS permission
	 */
	'GUILD_PRIVATE_THREAD' = 12,
	/**
	 * a voice channel for hosting events with an audience
	 */
	'GUILD_STAGE_VOICE' = 13,
}

export interface ChannelOverwrite {
	/**
	 * role or user id
	 * @var Snowflake
	 */
	id: Snowflake;
	/**
	 * either 0 (role) or 1 (member)
	 * @var number
	 */
	type: number;
	/**
	 * permission bit set
	 * @var string
	 */
	allow: string;
	/**
	 * permission bit set
	 * @var string
	 */
	deny: string;
}

export interface ThreadMetadata {
	/**
	 * whether the thread is archived
	 * @var boolean
	 */
	archived: boolean;
	/**
	 * duration in minutes to automatically archive the thread after recent activity, can be set to: 60, 1440, 4320,
	 * 10080
	 * @var number
	 */
	auto_archive_duration: number;
	/**
	 * timestamp when the thread's archive status was last changed, used for calculating recent activity
	 * @var number
	 */
	archive_timestamp: number;
	/**
	 * 	whether the thread is locked; when a thread is locked, only users with MANAGE_THREADS can unarchive it
	 * @var boolean
	 */
	locked: boolean;
	/**
	 * whether non-moderators can add other non-moderators to a thread; only available on private threads
	 * @var boolean
	 */
	invitable?: boolean;
	/**
	 * 	timestamp when the thread was created; only populated for threads created after 2022-01-09
	 * @var number
	 */
	create_timestamp?: number;
}

export interface ThreadMember {
	/**
	 * the id of the thread
	 * @var Snowflake
	 */
	id?: Snowflake;
	/**
	 * the id of the user
	 * @var Snowflake
	 */
	user_id?: Snowflake;
	/**
	 * the time the current user last joined the thread
	 * @var number
	 */
	join_timestamp: number;
	/**
	 * any user-thread settings, currently only used for notifications
	 * @var number
	 */
	flags: number;
}
