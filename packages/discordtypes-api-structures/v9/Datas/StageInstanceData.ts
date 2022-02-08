import { Snowflake } from "..";

export interface StageInstanceData {
  /**
   * The id of this Stage instance
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * The guild id of the associated Stage channel
   * @var Snowflake
   */
  guild_id: Snowflake;
  /**
   * The id of the associated Stage channel
   * @var Snowflake
   */
  channel_id: Snowflake;
  /**
   * The topic of the Stage instance (1-120 characters)
   * @var string
   */
  topic: string;
  /**
   * The privacy level of the Stage instance
   * @var number
   */
  privacy_level: number;
  /**
   * Whether or not Stage Discovery is disabled (deprecated)
   * @var boolean
   * @deprecated
   */
  discoverable_disabled: boolean;
}

export enum StageInstancePrivacyLevel {
  /**
   * The Stage instance is visible publicly. (deprecated)
   */
  'PUBLIC' = 1,
  /**
   * The Stage instance is visible to only guild members.
   */
  'GUILD_ONLY' = 2
}