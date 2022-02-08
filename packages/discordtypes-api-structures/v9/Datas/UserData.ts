import { Snowflake } from "..";

export interface UserData {
  /**
   * The user id
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * The user name
   * @var string
   */
  username: string;
  /**
   * The user's 4 digits
   * @var number
   */
  discriminator: number;
  /**
   * The user avatar hash
   * @var string
   */
  avatar: string|null;
  /**
   * If the user is a bot
   * @var boolean
   */
  bot?: false;
  /**
   * whether the user is an Official Discord System user 
   * @var boolean
   */
  system?: boolean;
  /**
   * whether the user has two factor enabled on their account	
   * @var boolean
   */
  mfa_enabled?: boolean;
  /**
   * the user's banner hash
   * @var string
   */
  banner?: string|null;
  /**
   * 	the user's banner color encoded as an integer representation of hexadecimal color code
   * @var number
   */
  accent_color?: number|null;
  /**
   * the user's chosen language option	
   * @var string
   */
  locale?: string;
  /**
   * whether the email on this account has been verified	
   * @var boolean
   */
  verified?: boolean;
  /**
   * the user's email	
   * @var string
   */
  email?: string;
  /**
   * the flags on a user's account	
   * @var number
   */
  flags?: number;
  /**
   * the public flags on a user's account	
   * @var number
   */
  public_flags?: number;
}

export enum UserFLAGS {
  'NONE' = 0,
  'STAFF' = 1 << 0,
  'PARTNER' = 1<< 1,
  'HYPESQUAD' = 1 << 2,
  'BUG_HUNTER_LEVEL_1	' = 1 << 3,
  'HYPESQUAD_ONLINE_HOUSE_1' = 1 << 6,
  'HYPESQUAD_ONLINE_HOUSE_2' = 1 << 7,
  'HYPESQUAD_ONLINE_HOUSE_3' = 1 << 8,
  'PREMIUM_EARLY_SUPPORTER' = 1 << 9,
  'TEAM_PSEUDO_USER' = 1 << 10,
  'BUG_HUNTER_LEVEL_2' = 1 << 14,
  'VERIFIED_BOT' = 1 << 16,
  'VERIFIED_DEVELOPER' = 1 << 17,
  'CERTIFIED_MODERATOR' = 1 << 18,
  'BOT_HTTP_INTERACTIONS' =  1 << 19
}

export enum UserSubscription {
  'None',
  'Nitro_Classic',
  'Nitro'
}