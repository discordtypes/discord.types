export class Intents {
	/**
	 * Resolve the intents array provide in client options
	 * @param BigUint64Array|number[] intents
	 * @returns
	 */
	public static resolveIntents(intents: bigint[] | number[]): number {
		var solvedIntent = 0;
		intents.forEach(intent => {
			solvedIntent += intent;
		});
		return solvedIntent;
	}
}

export enum IntentsFLAGS {
	/**
   * GUILDS:
      - GUILD_CREATE
      - GUILD_UPDATE
      - GUILD_DELETE
      - GUILD_ROLE_CREATE
      - GUILD_ROLE_UPDATE
      - GUILD_ROLE_DELETE
      - CHANNEL_CREATE
      - CHANNEL_UPDATE
      - CHANNEL_DELETE
      - CHANNEL_PINS_UPDATE
      - THREAD_CREATE
      - THREAD_UPDATE
      - THREAD_DELETE
      - THREAD_LIST_SYNC
      - THREAD_MEMBER_UPDATE
      - THREAD_MEMBERS_UPDATE 
      - STAGE_INSTANCE_CREATE
      - STAGE_INSTANCE_UPDATE
      - STAGE_INSTANCE_DELETE
   */
	'GUILDS' = 1 << 0,
	/**
   * GUILD_MEMBERS
      - GUILD_MEMBER_ADD
      - GUILD_MEMBER_UPDATE
      - GUILD_MEMBER_REMOVE
      - THREAD_MEMBERS_UPDATE
   */
	'GUILD_MEMBERS' = 1 << 1,
	/**
   * GUILD_BANS
      - GUILD_BAN_ADD
      - GUILD_BAN_REMOVE
   */
	'GUILD_BANS' = 1 << 2,
	/**
   * GUILD_EMOJIS_AND_STICKERS
      - GUILD_EMOJIS_UPDATE
      - GUILD_STICKERS_UPDATE
   */
	'GUILD_EMOJIS_AND_STICKERS' = 1 << 3,
	/**
   * GUILD_INTEGRATIONS
      - GUILD_INTEGRATIONS_UPDATE
      - INTEGRATION_CREATE
      - INTEGRATION_UPDATE
      - INTEGRATION_DELETE
   */
	'GUILD_INTEGRATIONS' = 1 << 4,
	/**
   * GUILD_WEBHOOKS
     - WEBHOOKS_UPDATE
   */
	'GUILD_WEBHOOKS' = 1 << 5,
	/**
   * GUILD_INVITES
      - INVITE_CREATE
      - INVITE_DELETE
   */
	'GUILD_INVITES' = 1 << 6,
	/**
   * GUILD_VOICE_STATES
      - VOICE_STATE_UPDATE
   */
	'GUILD_VOICE_STATES' = 1 << 7,
	/**
   * GUILD_PRESENCES
     - PRESENCE_UPDATE
   */
	'GUILD_PRESENCES' = 1 << 8,
	/**
   * GUILD_MESSAGES
      - MESSAGE_CREATE
      - MESSAGE_UPDATE
      - MESSAGE_DELETE
      - MESSAGE_DELETE_BULK
   */
	'GUILD_MESSAGES' = 1 << 9,
	/**
   * GUILD_MESSAGE_REACTIONS
      - MESSAGE_REACTION_ADD
      - MESSAGE_REACTION_REMOVE
      - MESSAGE_REACTION_REMOVE_ALL
      - MESSAGE_REACTION_REMOVE_EMOJI
   */
	'GUILD_MESSAGE_REACTIONS' = 1 << 10,
	/**
   * GUILD_MESSAGE_TYPING
      - TYPING_START
   */
	'GUILD_MESSAGE_TYPING' = 1 << 11,
	/**
   * DIRECT_MESSAGES
      - MESSAGE_CREATE
      - MESSAGE_UPDATE
      - MESSAGE_DELETE
      - CHANNEL_PINS_UPDATE
   */
	'DIRECT_MESSAGES' = 1 << 12,
	/**
   * DIRECT_MESSAGE_REACTIONS
      - MESSAGE_REACTION_ADD
      - MESSAGE_REACTION_REMOVE
      - MESSAGE_REACTION_REMOVE_ALL
      - MESSAGE_REACTION_REMOVE_EMOJI
   */
	'DIRECT_MESSAGE_REACTIONS' = 1 << 13,
	/**
   * DIRECT_MESSAGE_TYPING
      - TYPING_START
   */
	'DIRECT_MESSAGE_TYPING' = 1 << 14,
	/**
   * GUILD_SCHEDULED_EVENTS
      - GUILD_SCHEDULED_EVENT_CREATE
      - GUILD_SCHEDULED_EVENT_UPDATE
      - GUILD_SCHEDULED_EVENT_DELETE
      - GUILD_SCHEDULED_EVENT_USER_ADD
      - GUILD_SCHEDULED_EVENT_USER_REMOVE
   */
	'GUILD_SCHEDULED_EVENTS' = 1 << 16,
}
