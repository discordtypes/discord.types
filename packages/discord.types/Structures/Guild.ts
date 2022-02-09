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
import { Client } from '../Client';
import * as Routes from '../../discordtypes-api-structures/v9/Routes';

export class Guild {
	public id: Snowflake;
	public name: string;
	public icon: string;
	public icon_hash?: string;
	public splash: string;
	public discovery_spash: string;
	public owner?: boolean;
	public owner_id: Snowflake;
	public permissions?: string;
	public region?: string;
	public afk_channel_id: Snowflake;
	public afk_timeout: number;
	public widget_enabled?: boolean;
	public widget_channel_id: Snowflake;
	public verification_level: number;
	public default_message_notifications: number;
	public explicit_content_filter: number;
	public roles: RoleData[];
	public emojis: EmojiData[];
	public features: string[];
	public mfa_level: number;
	public application_id: Snowflake;
	public system_channel_id: Snowflake;
	public system_channel_flags: number;
	public rules_channel_id: Snowflake;
	public joined_at?: number;
	public large?: boolean;
	public unavailable?: boolean;
	public member_count?: number;
	public voice_states?: VoiceSateData[];
	public members: GuildMember[];
	public channels?: ChannelData[];
	public threads?: ChannelData[];
	public presences?: PresenceUpdateData[];
	public max_presences?: number;
	public max_members?: number;
	public vanity_url_code: string;
	public description: string;
	public banner: string;
	public premium_tier: number;
	public premium_subscription_count?: number;
	public preferred_locale: string;
	public public_updates_channel_id: Snowflake;
	public max_video_channel_users?: number;
	public approximate_member_count?: number;
	public approximate_presence_count?: number;
	public welcome_screen?: GuildWelcomeScreen;
	public nsfw_level: number;
	public stage_instances?: StageInstanceData[];
	public stickers?: StickerData[];
	public guild_scheduled_events?: GuildScheduledEvent[];
	public premium_progress_bar_enabled: boolean;

	public constructor(private client: Client, datas: IGuild){
		this.init(datas)
	}

	private init(d: IGuild){
		this.id = d.id;
		this.name = d.name;
		this.icon = d.icon;
		this.features = d.features;

		if(!d) return;
		if (d.unavailable){
			this.unavailable = true;
		}else {
			//ToDo: Patch all the datas for available guilds
		}
	}

	public async fetch() {
		var d = await this.client.api.get(Routes.GUILD(this.id));
		this.client.guilds._add(d);
	}
}
