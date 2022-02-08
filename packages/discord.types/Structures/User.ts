import { Snowflake } from "../../discordtypes-api-structures/v9";

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
  status: UserPresenceStatusLike;
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
  created_at: number;
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
   * @var UserActivityButtons
   */
  buttons?: UserActivityButtons;
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