import { UserPresence, UserPresenceStatus } from ".";
import {User} from './User'; 
import { GatewayPresenceUpdate, UserData } from "../../discordtypes-api-structures/v9";
import { Client } from "../Client";

export class ClientUser extends User {

  /**
   * The client user presence
   * @var UserPresence
   */
  public presence?: UserPresence;

  /**
   * ClientUser constructor
   * @param Client client
   * @param UserData data
   */
  public constructor(client: Client, data: UserData){
    super(client, data);
  }

  /**
   * Resolve the presence
   * @returns
   */
  public resolvePresence(): UserPresence|null {
    if(this.presence) return this.presence
    return null;
  }

  /**
   * Set the client user presence
   * @param GatewayPresenceUpdate presence
   */
  public setPresence(presence: GatewayPresenceUpdate): void {
    this.presence = presence;
    this.client.ws.updatePresence();
  }
}