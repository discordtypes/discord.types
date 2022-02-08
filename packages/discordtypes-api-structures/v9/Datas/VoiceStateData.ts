import { Snowflake } from "..";
import { GuildMember } from "./GuildData";

export interface VoiceSateData {
  /**
   * the guild id this voice state is for
   * @var Snowflake
   */
  guild_id?: Snowflake;
  /**
   * the channel id this user is connected to
   * @var Snowflake
   */
  channel_id: Snowflake|null;
  /**
   * the user id this voice state is for
   * @var Snowflake
   */
  user_id: Snowflake;
  /**
   * the guild member this voice state is for
   * @var GuildMember
   */
  member?: GuildMember
  /**
   * the session id for this voice state
   * @var string
   */
  session_id: string;
  /**
   * whether this user is deafened by the server
   * @var boolean
   */
  deaf: boolean;
  /**
   * whether this user is muted by the server
   * @var boolean
   */
  muted: boolean;
  /**
   * whether this user is locally deafened
   * @var boolean
   */
  self_deaf: boolean;
  /**
   * whether this user is locally muted
   * @var boolean
   */
  self_muted: boolean;
  /**
   * whether this user is streaming using "Go Live"
   * @var boolean
   */
  self_stream?: boolean;
  /**
   * whether this user's camera is enabled
   * @var boolean
   */
  self_video: boolean;
  /**
   * whether this user is muted by the current user
   * @var boolean
   */
  supress: boolean;
  /**
   * the time at which the user requested to speak
   * @var number
   */
  request_to_speak_timestamp: boolean;
}