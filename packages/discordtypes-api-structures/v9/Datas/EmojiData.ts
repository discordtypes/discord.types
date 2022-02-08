import { RoleData, UserData } from ".";
import { Snowflake } from "..";

export interface EmojiData {
  /**
   * Emoji id
   * @var Snowflake
   */
  id: Snowflake|null;
  /**
   * Emoji name
   * @var string
   */
  name: string;
  /**
   * roles allowed to use this emoji
   * @var RoleData[]
   */
  roles?: RoleData[];
  /**
   * The user object
   * @var UserData
   */
  user?: UserData;
  /**
   * whether this emoji must be wrapped in colons
   * @var boolean
   */
  require_colons?: boolean;
  /**
   * whether this emoji is managed
   * @var string
   */
  managed?: boolean;
  /**
   * whether this emoji is animated
   * @var boolean
   */
  animated?: boolean;
  /**
   * whether this emoji can be used, may be false due to loss of Server Boosts
   * @var boolean
   */
  available?: boolean;
}