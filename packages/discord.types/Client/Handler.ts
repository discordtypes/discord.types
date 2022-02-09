import { Client, Events, READY } from ".";
import { GatewayDispatchData } from "../../discordtypes-api-structures/v9";

export class Handler {
  /**
   * Handle the messages
   * @param Client client
   * @param GatewayDispatchData m
   */
  public static async handle(client: Client, d: GatewayDispatchData){
    switch(d.t){
      case Events.GUILD_CREATE:
        console.log(d.d)
       //ToDo: Handle this
      case Events.READY:
        READY.run(client, d);
        break;
    }
  }
}