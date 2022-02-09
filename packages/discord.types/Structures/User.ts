import { DiscordSnowflake, Snowflake, UserData } from "../../discordtypes-api-structures/v9";
import { Client } from "../Client";

export type UserPresenceStatusLike = 'online'|'dnd'|'idle'|'invisible'|'offline';
export type UserPresenceActivityTypeLike = 0|1|2|3|4|5;

export interface UserPresence {
  /**
   * unix time (in milliseconds) of when the client went idle, or null if the client is not idle
   * @var number|null
  **/
  since: number|null;
  /**
   * The user's activities
   * @var UserActivity[]
   */
  activities: UserActivity[];
  /**
   * The user status
   * @var UserPresenceStatusLike
   */
  status: UserPresenceStatusLike|string;
}

export enum UserPresenceStatus {
  "Online" = "online",
  "DND" = "dnd",
  "Idle" = "idle",
  "Invisible" = "invisible",
  "Offline" = "offline" 
}

export interface UserActivity {
  /**
   * The activity's name
   * @var string
   */
  name: string;
  /**
   * The activity type
   * @var UserPresenceActivityTypeLike
   */
  type: UserPresenceActivityTypeLike;
  /**
   * The activity url
   * @var string|null
   */
  url?: string|null;
  /**
   * When the user activity is created
   * @var number
   */
  created_at?: number;
  /**
   * unix timestamps for start and/or end of the game
   * @var UserActivityTimestamps
   */
  timestamps?: UserActivityTimestamps;
  /**
   * The application id for the game
   * @var Snowflake
   */
  application_id?: Snowflake;
  /**
   * What the player is currently doing
   * @var string|null
   */
  details?: string|null;
  /**
   * the user's current party status
   * @var string|null
   */
  state?: string|null;
  /**
   * the emoji used for a custom status
   * @var UserActivityEmoji
   */
  emoji?: UserActivityEmoji;
  /**
   * information for the current party of the player
   * @var UserActivityParty
   */
  party?: UserActivityParty;
  /**
   * images for the presence and their hover texts
   * @var UserActivityAssets
   */
  assets?: UserActivityAssets;
  /**
   * secrets for Rich Presence joining and spectating
   * @var UserActivitySecrets 
   */
  secrets?: UserActivitySecrets;
  /**
   * whether or not the activity is an instanced game session
   * @var boolean
   */
  instance?: boolean;
  /**
   * activity flags OR together, describes what the payload includes
   * @var number
   */
  flags?: number;
  /**
   * the custom buttons shown in the Rich Presence (max 2)
   * @var UserActivityButtons[]
   */
  buttons?: UserActivityButtons[];
}

export interface UserActivityTimestamps {
  /**
   * unix time (in milliseconds) of when the activity started
   * @var number
   */
  start?: number;
  /**
   * unix time (in milliseconds) of when the activity ends
   * @var number
   */
  end?: number;
}

export interface UserActivityEmoji {
  /**
   * the name of the emoji
   * @var string
   */
  name: string;
  /**
   * the id of the emoji
   * @var Snowflake
   */
  id?: Snowflake;
  /**
   * If the emoji is animated
   * @var boolean
   */
  animated?: boolean;
}

export interface UserActivityParty {
  /**
   * the id of the party
   * @var Snowflake
   */
  id?: string;
  /**
   * used to show the party's current and maximum size, array of two numbers (current_size, max_size)
   * @var number[]
   */
  size?: number[];
}

export interface UserActivityAssets {
  /**
   * @var string
   */
  large_image?: string;
  /**
   * text displayed when hovering over the large image of the activity
   * @var string
   */
  large_text?: string;
  /**
   * @var string
   */
  small_image?: string;
  /**
   * text displayed when hovering over the small image of the activity
   * @var string
   */
  small_text?: string;
}

export interface UserActivitySecrets {
  /**
   * the secret for joining a party
   * @var string
   */
  join?: string;
  /**
   * the secret for spectating a game
   * @var string
   */
  spectate?: string;
  /**
   * the secret for a specific instanced match
   * @var string
   */
  match?: string;
}

export interface UserActivityButtons {
  /**
   * the text shown on the button (1-32 characters)
   * @var string
   */
  label: string;
  /**
   * the url opened when clicking the button (1-512 characters)
   * @var string
   */
  url: string;
}

export class User {
  public id: `${bigint}`;
  public username: string;
  public discriminator: number;
  public created_at: number;
  public avatar: string|null;
  public bot?: false;
  public system?: boolean;
  public mfa_enabled?: boolean;
  public banner?: string|null;
  public accent_color?: number;
  public locale?: string;
  public verified?: boolean;
  public email?: string;
  public flags?: number;
  public public_flags?: number;

  /**
   * User constructor
   * @param Client client
   * @param UserData data
   */
  public constructor(protected client: Client, private data: UserData){
    this.id = data.id
    this.username = data.username
    this.discriminator = data.discriminator
    this.avatar = data.avatar
    if('bot' in data){
      this.bot = data.bot
    }
    if('system' in data){
      this.system = data.system
    }
    if('mfa_enabled' in data){
      this.mfa_enabled = data.mfa_enabled
    }
    if('banner' in data){
      this.banner = data.banner
    }
    if('accent_color' in data){
      this.accent_color = data.accent_color
    }
    if('locale' in data){
      this.locale = data.locale
    }
    if('verified' in data){
      this.verified = data.verified
    }
    if('email' in data){
      this.email = data.email
    }
    if('flags' in data){
      this.flags = data.flags
    }
    if('public_flags' in data){
      this.public_flags = data.public_flags
    }

    this.created_at = new DiscordSnowflake(this.id).toTimestamp();
  }

  /**
   * Return the avatar of the user. If the avatar hash is null, retourning null
   * @returns
   */
   public avatarUrl(): string|null {
    return this.avatar ? this.client.api.cdn.userAvatar(this.id, this.avatar) : null
  }

  /**
   * Return the default user avatar url
   * @returns
   */
  public defaultAvatarUrl(): string {
    return this.client.api.cdn.defaultUserAvatarUrl(this.discriminator);
  }

  /**
   * Return the actual avatar url of the user
   * @returns
   */
  public displayAvatarUrl(): string {
    return this.avatar ? this.avatarUrl() : this.defaultAvatarUrl();
  }

  /**
   * Return a user-readable string value
   * @returns
   */
  public __toString(): string {
    return this.username;
  }

  /**
   * Return a user-readble json value
   * @returns
   */
  public __toJSON(): Object {
    return this.data;
  }
}