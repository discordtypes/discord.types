import { Client } from "..";
import { GatewayDispatchData } from "../../../discordtypes-api-structures/v9";
import { Guild } from "../../Structures";

export class READY {
  public static async run(client: Client, datas: GatewayDispatchData) {
    console.log(datas.d.guilds)
    //add all the guilds in the guild manager
    for(var g of datas.d.guilds){
      await client.guilds._add(new Guild(client, g));
    }

    //emit the event
    await client.emit('ready')
  }
}