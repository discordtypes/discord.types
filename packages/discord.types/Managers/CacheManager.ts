import { Snowflake } from "../../discordtypes-api-structures/v9";
import { Client } from "../Client";
import { Collection } from "../Utils/";

export class CacheManager {
  /**
   * CacheManager constructor
   * @param Client client
   */
  public constructor(protected client: Client, public cache: Collection<Snowflake, any>){}

  /**
   * Resolve a key stored in the cache by the id(the key). If the key was not found in the cache, it's returns null
   * @param Snowflake id
   * @returns 
   */
  public resolve(id: Snowflake): any {
    return this.cache.has(id) ? this.cache.get(id) : null; 
  }
}