import { Client } from "..";
import { GatewayDispatchData, IGuild } from "../../../discordtypes-api-structures/v9";
import { Guild } from "../../Structures";

export class GUILD_CREATE {
  /**
   * Run the guild create event action
   * @param Client client
   * @param GatewayDispatchData datas
   */
  public static async run(client: Client, datas: GatewayDispatchData) {
    if(typeof datas.d === 'object'){
      var g = datas.d;
      //Check if the guild exists in the client guild cache, if not, create a new guild
      if(!client.guilds.cache.has(g.id)){
        client.guilds._add(new Guild(client, g));
        client.emit('guildCreate')
      }else {
        client.guilds._update(new Guild(client, g));
      }
    }else {
      datas.d.forEeach(async (g) => {
        //Check if the guild exists in the client guild cache, if not, create a new guild
        if(!client.guilds.cache.has(g.id)){
          client.guilds._add(new Guild(client, g));
          client.emit('guildCreate')
        }else {
          client.guilds._update(new Guild(client, g));
        }
      })
    }
  }
}