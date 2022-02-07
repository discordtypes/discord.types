import { Snowflake } from "..";

export interface RoleData{
  /**
   * The rolde id
   * @var Snowflake
   */
  id: Snowflake;
  /**
   * The role name
   * @var string
   */
  name: string;
  /**
   * integer representation of hexadecimal color code
   * @var number
   */
  color: number;
  /**
   * if this role is pinned in the user listing
   * @var boolean
   */
  hoist: boolean;
  /**
   * role icon hash
   * @var string
   */
  icon?: string|null;
  /**
   * role unicode emoji
   * @var string
   */
  unicode_emoji?: string|null;
  /**
   * position of this role
   * @var number
   */
  position: number;
  /**
   * permission bit set
   * @var string
   */
  permissions: string;
  /**
   * whether this role is managed by an integration
   * @var boolean
   */
  managed: boolean;
  /**
   * whether this role is mentionable
   * @var boolean
   */
  mentionable: boolean;
  /**
   * the tags this role has
   * @var RoleTags
   */
  tags?: RoleTags;
}

export interface RoleTags {
  /**
   * the id of the bot this role belongs to
   * @var Snowflake
   */
  bot_id?: Snowflake;
  /**
   * the id of the integration this role belongs to
   * @var Snowflake
   */
  integration_id?: Snowflake;
  /**
   * whether this is the guild's premium subscriber role
   * @var null
   */
  premium_subscriber?: null;
}