import { CacheManager } from ".";
import { Snowflake } from "../../discordtypes-api-structures/v9";
import { IGuild } from "../../discordtypes-api-structures/v9/Datas";
import { Client } from "../Client";
import { Guild } from "../Structures/";
import { Collection } from "../Utils";

export class GuildManager extends CacheManager {
  public constructor(client: Client){
    super(client, new Collection<Snowflake, IGuild>());
  }

  /** 
   * Add a guild to the cache
   * @param Guild guild
  **/
  public _add(guild: Guild): void {
    !this.cache.has(guild.id) ?? this.cache.set(guild.id, guild)
  }

  /**
   * Fetch a guild from the cache
   * @param Snowflake guildId
   * @returns
   */
  public fetch(guildId: Snowflake): Guild|null {
    return this.cache.has(guildId) ? this.cache.get(guildId) : null;
  }
}