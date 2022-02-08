import { RoleData, EmojiData, VoiceSateData, ChannelData, PresenceUpdateData, StageInstanceData, UserData } from ".";
import { Snowflake } from "..";
import { StickerData } from "./StickerData";

export interface IGuild {
  /**
   * The guild id
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * The guild name (2-100 characters, excluding trailing and leading whitespace)
   * @var string
   */
  name: string;
  /**
   * The icon hash
   * @var string
   */
  icon: string|null;
  /**
   * The icon hash, returned when in the template object
   * @var string
   */
  icon_hash?: string|null;
  /**
   * The splash hash
   * @var string
   */
  splash: string|null;
  /**
   * 	discovery splash hash; only present for guilds with the "DISCOVERABLE" feature
   * @var string
   */
  discovery_spash: string|null;
  /**
   * If the user is the owner of this guild
   * @var boolean
   */
  owner?: boolean;
  /**
   * The owner's id of this guild
   * @var Snowflake
   */
  owner_id: Snowflake;
  /**
   * total permissions for the user in the guild (excludes overwrites)
   * @var string
   */
  permissions?: string;
  /**
   * 	voice region id for the guild (deprecated)
   * @deprecated
   * @var string
   */
  region?: string;
  /**
   * The afk channel's id
   * @var Snowflake
   */
  afk_channel_id: Snowflake|null;
  /**
   * The afk timeout in seconds
   * @var number
   */
  afk_timeout: number;
  /**
   * If the server widget is enabled
   * @var boolean
   */
  widget_enabled?: boolean;
  /**
   * 	the channel id that the widget will generate an invite to, or null if set to no invite
   * @var Snowflake
   */
  widget_channel_id: Snowflake|null;
  /**
   * verification level required for the guild
   * @var number
   */
  verification_level: number;
  /**
   * default message notifications level
   * @var number
   */
  default_message_notifications: number;
  /**
   * The explicit content filter level
   * @var number
   */
  explicit_content_filter: number;
  /**
   * All the roles in the guild
   * @var RoleData[]
   */
  roles: RoleData[];
  /**
   * All the emojis in the guild
   * @var EmojiData
   */
  emojis: EmojiData[];
  /**
   * Enabled guild features
   * @var string[]
   */
  features: string[];
  /**
   * required MFA level for the guild
   * @var number
   */
  mfa_level: number;
  /**
   * application id of the guild creator if it is bot-created
   * @var Snowflake
   */
  application_id: Snowflake|null;
  /**
   * 	the id of the channel where guild notices such as welcome messages and boost events are posted
   * @var Snowflake
   */
  system_channel_id: Snowflake|null;
  /**
   * 	The system channel flags
   * @var number
   */
  system_channel_flags: number;
   /**
    * the id of the channel where Community guilds can display rules and/or guidelines
    * @var Snowflake
    */
  rules_channel_id: Snowflake|null;
  /**
   * when this guild was joined at
   * @var number
   */
  joined_at?: number;
  /**
   * true if this is considered a large guild
   * @var boolean
   */
  large?: boolean;
  /**
   * true if this guild is unavailable due to an outage
   * @var boolean
   */
  unavailable?: boolean;
  /**
   * total number of members in this guild
   * @var number
   */
  member_count?: number;
  /**
   * states of members currently in voice channels; lacks the guild_id key
   * @var VoiceStateData[]
   */
  voice_states?: VoiceSateData[];
  /**
   * users in the guild
   * @var GuildMember[]
   */
  members: GuildMember[];
  /**
   * 	channels in the guild
   * @var ChannelData[]
   */
  channels?: ChannelData[];
  /**
   * all active threads in the guild that current user has permission to view
   * @var ChannelData[]
   */
  threads?: ChannelData[];
  /**
   * 	presences of the members in the guild, will only include non-offline members if the size is greater than 
   * large threshold
   * @var PresenceUpdateData[]
   */
  presences?: PresenceUpdateData[];
  /**
   * 	the maximum number of presences for the guild (null is always returned, apart from the largest of guilds)
   * @var number
   */
  max_presences?: number|null;
  /**
   * the maximum number of members for the guild
   * @var number
   */
  max_members?: number;
  /**
   * the vanity url code for the guild
   * @var string
   */
  vanity_url_code: string|null;
  /**
   * the description of a Community guild
   * @var string
   */
  description: string|null;
  /**
   * The guild banner's hash
   * @var string
   */
  banner: string|null;
  /**
   * The server boost level
   * @var number
   */
  premium_tier: number;
  /**
   * the number of boosts this guild currently has
   * @var number 
  */	
  premium_subscription_count?: number;
  /**
   * 	the preferred locale of a Community guild; used in server discovery and notices from Discord, and sent in 
   * interactions; defaults to "en-US"
   * @var string
  */	
 preferred_locale: string;
 /**
  *	the id of the channel where admins and moderators of Community guilds receive notices from Discord
  * @var Snowflake  
 */	
  public_updates_channel_id: Snowflake|null;
  /**
   * the maximum amount of users in a video channel
   * @var number
   */
  max_video_channel_users?: number;
  /**
   * approximate number of members in this guild, returned from the GET /guilds/<id> endpoint when with_counts is 
   * true
   * @var number 
  */	
  approximate_member_count?: number;
  /**
   * approximate number of non-offline members in this guild, returned from the GET /guilds/<id> endpoint when 
   * with_counts is true
   * @var number
  */	 
 approximate_presence_count?: number;
  /**
    * the welcome screen of a Community guild, shown to new members, returned in an Invite's guild object
    * @var GuildWelcomeScreen
  */	
  welcome_screen?: GuildWelcomeScreen;
  /**
    * The guild nsfw level
    * @var number
  */
 nsfw_level: number;
 /**
  * Stage instances in the guild
  * @var StageInstanceData[]
  */
 stage_instances?: StageInstanceData[];
 /**
  * custom guild stickers
  * @var StickerData[]
  */
 stickers?: StickerData[];
 /**
  * the scheduled events in the guild
  * @var GuildScheduledEvent[]
  */
 guild_scheduled_events?: GuildScheduledEvent[];
 /**
  * whether the guild has the boost progress bar enabled
  * @var boolean
  */
 premium_progress_bar_enabled: boolean;
}

export enum GuildFeatures {
  'ANIMATED_ICON' = 'ANIMATED_ICON',
  'BANNER' = 'BANNER',
  'COMMERCE' = 'COMMERCE',
  'COMMUNITY' = 'COMMUNITY',
  'DISCOVERABLE' = 'DISCOVERABLE',
  'FEATURABLE' = 'FEATURABLE',
  'INVITE_SPLASH' = 'INVITE_SPLASH',
  'MEMBER_VERIFICATION_GATE_ENABLED' = 'MEMBER_VERIFICATION_GATE_ENABLED',
  'MONETIZATION_ENABLED' = 'MONETIZATION_ENABLED',
  'MORE_STICKERS' = 'MORE_STICKERS',
  'NEWS' = 'NEWS',
  'PARTNERED' = 'PARTNERED',
  'PREVIEW_ENABLED' = 'PREVIEW_ENABLED',
  'PRIVATE_THREADS' = 'PRIVATE_THREADS',
  'ROLE_ICONS' = 'ROLE_ICONS',
  'SEVEN_DAY_THREAD_ARCHIVE' = 'SEVEN_DAY_THREAD_ARCHIVE',
  'THREE_DAY_THREAD_ARCHIVE' = 'THREE_DAY_THREAD_ARCHIVE',
  'TICKETED_EVENTS_ENABLED' = 'TICKETED_EVENTS_ENABLED',
  'VANITY_URL' = 'VANITY_URL',
  'VERIFIED' = 'VERIFIED',
  'VIP_REGIONS' = 'VIP_REGIONS',
  'WELCOME_SCREEN_ENABLED' = 'WELCOME_SCREEN_ENABLED'
}

export enum SystemChannelsFLAGS {
  /**
   * Suppress member join notifications
   */
  'SUPPRESS_JOIN_NOTIFICATIONS' = 1 << 0,
  /**
   * Suppress server boost notifications
   */
  'SUPPRESS_PREMIUM_SUBSCRIPTIONS' = 1 << 1,
  /**
   * Suppress server setup tips
  */
 'SUPPRESS_GUILD_REMINDER_NOTIFICATIONS' = 1 << 2,
 /**
  * Hide member join sticker reply buttons
 */
'SUPPRESS_JOIN_NOTIFICATION_REPLIES' = 1 << 3  
}

export interface GuildMember {
  /**
   * the user this guild member represents
   * @var UserData
   */
  user?: UserData;
  /**
   * this user's guild nickname
   * @var string
   */
  nick?: string;
  /**
   * the member's guild avatar hash
   * @var string
   */
  avatar?: string|null;
  /**
   * array of role object ids
   * @var Snowflake[]
   */
  roles: Snowflake[];
  /**
   * when the user joined the guild
   * @var number
   */
  joined_at: number;
  /**
   * when the user started boosting the guild
   * @var number
   */
  premium_since?: number|null;
  /**
    * whether the user is deafened in voice channels
    * @var boolean
  */	
  deaf: boolean;
  /**
   * whether the user is muted in voice channels
   * @var boolean
   */
  mute: boolean;
  /**
   * whether the user has not yet passed the guild's Membership Screening requirements
   * @var boolean
   */
  pending?: boolean;
  /**
   * total permissions of the member in the channel, including overwrites, returned when in the interaction object
   * @var string
   */
  permissions?: string;
  /**
   * when the user's timeout will expire and the user will be able to communicate in the guild again, null or a 
   * time in the past if the user is not timed out
   * @var number
   */
  communication_disabled_until?: number;
}

export interface GuildWelcomeScreen {
  /**
   * the server description shown in the welcome screen
   * @var string
   */
  description: string|null;

}

export interface GuildWelcomeScreenChannel {
  /**
   * the channel's id
   * @var Snowflake
   */
  channel_id: Snowflake;
  /**
   * the description shown for the channel
   * @var string
   */
  description: string;
  /**
   * the emoji id, if the emoji is custom
   * @var Snowflake
   */
  emoji_id: Snowflake|null;
  /**
   * the emoji name if custom, the unicode character if standard, or null if no emoji is set
   * @var string
   */
  emoji_name: string|null;
}

export enum GuildNsfwLevel {
  'DEFAULT' = 0,
  'EXPLICIT' = 1,
  'SAFE' = 2,
  'AGE_RESTRICTED' = 3
}

export interface GuildScheduledEvent {
  /**
   * the id of the scheduled event
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * the guild id which the scheduled event belongs to
   * @var Snowflake
   */
  guild_id: Snowflake;
  /**
   * the channel id in which the scheduled event will be hosted, or null if scheduled entity type is EXTERNAL
   * @var Snowflake
   */
  channel_id: Snowflake|null;
  /**
   * the id of the user that created the scheduled event
   * @var Snowflake
   */
  creator_id: Snowflake|null;
  /**
   * the name of the scheduled event (1-100 characters)
   * @var string
   */
  name: string;
  /**
   * the description of the scheduled event (1-1000 characters)
   * @var string
   */
  description?: string;
  /**
   * the time the scheduled event will start
   * @var number
   */
  scheduled_start_time: number;
  /**
   * the time the scheduled event will end, required if entity_type is EXTERNAL
   * @var number
   */
  scheduled_end_time: number|null;
  /**
   * the privacy level of the scheduled event
   * @var number
   */
  privacy_level: number;
  /**
   * the status of the scheduled event
   * @var number
   */
  status: number;
  /**
   * the type of the scheduled event
   * @var number
   */
  entity_type: number;
  /**
   * the id of an entity associated with a guild scheduled event
   * @var Snowflake
   */
  entity_id: Snowflake|null;
  /**
   * additional metadata for the guild scheduled event
   * @var GuildScheduledEventEntityTypeMetadata
   */
  entity_metadata: GuildScheduledEventEntityTypeMetadata;
  /**
   * the user that created the scheduled event
   * @var UserData
   */
  creator?: UserData;
  /**
   * the number of users subscribed to the scheduled event
   * @var number
   */
  user_count?: number;
  /**
   * the cover image hash of the scheduled event
   * @var string
   */
  image: string|null;
}

export enum GuildScheduledEventStatus {
  'SCHEDULED' = 1,
  'ACTIVE' = 2,
  'COMPLETED' = 3,
  'CANCELED' = 4
}

export enum GuildScheduledEventPrivacyLevel {
  /**
   * the scheduled event is only accessible to guild members
   */
  'GUILD_ONLY' = 2
}

export enum GuildScheduledEventEntityTypes {
  'STAGE_INSTANCE' = 1,
  'VOICE' = 2,
  'EXTERNAL' = 3
}

export interface GuildScheduledEventEntityTypeMetadata {
  /**
   * location of the event (1-100 characters)
   * @var string
   */
  location: string;
}