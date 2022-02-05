export type Snowflake = `${bigint}`;

export interface DeconstructSnowflake {
  id: Snowflake,
  timestamp: bigint;
  internal_worker_id: number|bigint;
  internal_process_id: number|bigint;
  increment: number|bigint;
}

export class DiscordSnowflake {
  /** 
   * Epoch date timestamp. 
   * https://discord.com/developers/docs/reference#snowflake
   */
  #epoch: bigint;

  /**
   * The snowflake to deconstruct
   */
  #id: Snowflake;

  /**
   * DiscordSnowflake constructor
   * 
   * @param Snowflake           id
   * @param number                epoch
   */
  public constructor(id: Snowflake, epoch: bigint|Date|number = 1420070400000){
    this.#id = id;
    this.#epoch = BigInt(epoch instanceof Date ? epoch.getDate() : epoch);
  }

  /**
   * Deconstruct a Snowflake and return it's datas
   * https://discord.com/developers/docs/reference#snowflake
   * 
   * @return DeconstructSnowflake
   */
  public deconstruct(): DeconstructSnowflake {
    var id = BigInt(this.#id);
    return {
      id: this.#id,
      timestamp: (id >> 22n) + this.#epoch,
      internal_worker_id: (id >> 17n) & 0b11111n,
      internal_process_id: (id >> 12n) & 0b11111n,
      increment: id & 0b111111111111n
    }
  }

  /**
   * Return the timestap field's value
   * 
   * @return number
   */
  public toTimestamp(): number{
    return Number(this.deconstruct().timestamp)
  }
}