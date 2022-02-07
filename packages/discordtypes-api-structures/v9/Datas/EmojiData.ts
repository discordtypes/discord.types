import { RoleData } from ".";
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
  //ToDo: RESTE
}