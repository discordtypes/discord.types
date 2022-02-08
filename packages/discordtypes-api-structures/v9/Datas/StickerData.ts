import { UserData } from ".";
import { Snowflake } from "..";

export interface StickerData {
  /**
   * The id of the sticker
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * for standard stickers, id of the pack the sticker is from
   * @var Snowflake
   */
  pack_id?: Snowflake;
  /**
   * name of the sticker
   * @var string
   */
  name: string;
  /**
   * description of the sticker
   * @var string
   */
  description: string|null;
  /**
   * autocomplete/suggestion tags for the sticker (max 200 characters)
   * @var string
   */
  tags: string;
  /**
   * Deprecated previously the sticker asset hash, now an empty string
   * @var string
   * @deprecated
   */
  asset: string;
  /**
   * 	type of sticker
   * @var number
   */
  type: number;
  /**
   * type of sticker format
   * @var number
   */
  format_type: number;
  /**
   * whether this guild sticker can be used, may be false due to loss of Server Boosts
   * @var boolean
   */
  available?: boolean;
  /**
   * id of the guild that owns this sticker
   * @var Snowflake
   */
  guild_id?: Snowflake;
  /**
   * the user that uploaded the guild sticker
   * @var UserData
   */
  user?: UserData;
  /**
   * the standard sticker's sort order within its pack
   * @var number
   */
  sort_value?: number;
}

export enum StickerTypes {
  /**
   * an official sticker in a pack, part of Nitro or in a removed purchasable pack
   */
  'STANDARD' = 1,
  /**
   * a sticker uploaded to a Boosted guild for the guild's members
   */
  'GUILD' = 2
}

export enum StickerFormatTypes {
  'PNG' = 1,
  'APNG' = 2,
  'LOTTIE' = 3
}