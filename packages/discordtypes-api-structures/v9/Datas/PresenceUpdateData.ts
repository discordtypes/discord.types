import { ClientStatusData, UserData } from ".";
import { Snowflake } from "..";
import { UserActivity, UserPresenceStatusLike } from "../../../discord.types/Structures";

export interface PresenceUpdateData {
  /**
   * the user presence is being updated for
   * @var UserData
   */
  user: UserData;
  /**
   * the id of the guild
   * @var Snowflake
   */
  guild_id: Snowflake;
  /**
   * 	either "idle", "dnd", "online", or "offline"
   * @var UserPresenceStatusLike
   */
  status: UserPresenceStatusLike;
  /**
   * user's current activities
   * @var UserActivity[]
   */
  activities: UserActivity[];
  /**
   * user's platform-dependent status
   * @var ClientStatusData
   */
  client_status: ClientStatusData;
}