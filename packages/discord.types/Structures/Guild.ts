import {
	ChannelData,
	EmojiData,
	GuildMember,
	GuildScheduledEvent,
	GuildWelcomeScreen,
	IGuild,
	PresenceUpdateData,
	RoleData,
	Snowflake,
	StageInstanceData,
	VoiceSateData,
} from '../../discordtypes-api-structures/v9';
import { StickerData } from '../../discordtypes-api-structures/v9/Datas/StickerData';

export class Guild implements IGuild {
	id: Snowflake;
	name: string;
	icon: string;
	icon_hash?: string;
	splash: string;
	discovery_spash: string;
	owner?: boolean;
	owner_id: Snowflake;
	permissions?: string;
	region?: string;
	afk_channel_id: Snowflake;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id: Snowflake;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: RoleData[];
	emojis: EmojiData[];
	features: string[];
	mfa_level: number;
	application_id: Snowflake;
	system_channel_id: Snowflake;
	system_channel_flags: number;
	rules_channel_id: Snowflake;
	joined_at?: number;
	large?: boolean;
	unavailable?: boolean;
	member_count?: number;
	voice_states?: VoiceSateData[];
	members: GuildMember[];
	channels?: ChannelData[];
	threads?: ChannelData[];
	presences?: PresenceUpdateData[];
	max_presences?: number;
	max_members?: number;
	vanity_url_code: string;
	description: string;
	banner: string;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id: Snowflake;
	max_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: GuildWelcomeScreen;
	nsfw_level: number;
	stage_instances?: StageInstanceData[];
	stickers?: StickerData[];
	guild_scheduled_events?: GuildScheduledEvent[];
	premium_progress_bar_enabled: boolean;
}
