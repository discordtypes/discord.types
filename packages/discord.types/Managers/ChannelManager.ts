import { CacheManager } from "./CacheManager";
import { Snowflake, ChannelData } from "../../discordtypes-api-structures/v9";
import { Client } from "../Client";
import { Collection } from "../Utils";

export class ChannelManager extends CacheManager {
  public constructor(client: Client){
    super(client, new Collection<Snowflake, ChannelData>());
  }
}