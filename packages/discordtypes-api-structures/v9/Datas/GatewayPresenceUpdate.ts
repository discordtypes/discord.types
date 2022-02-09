import { UserPresence } from "../../../discord.types/Structures";

export interface GatewayPresenceUpdate extends UserPresence {
  /**
   * whether or not the client is afk
   * @var boolean
   */
  afk: boolean;
}