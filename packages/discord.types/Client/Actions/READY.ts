import { Client } from "..";
import { GatewayDispatchData } from "../../../discordtypes-api-structures/v9";
import { ClientUser, Guild } from "../../Structures";

export class READY {
  /**
   * Run the ready action event
   * @param Client client
   * @param GatewayDispatchData datas
   */
  public static async run(client: Client, datas: GatewayDispatchData) {
    datas.d.guilds.forEach((g) => {
      client.guilds._add(new Guild(client, g));
    })

    client.user = new ClientUser(client, datas.d.user); 

    //emit the event
    await client.emit('ready')
  }
}