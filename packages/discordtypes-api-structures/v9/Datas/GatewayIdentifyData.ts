import {UserPresence} from '../../../discord.types/Structures';

export interface GatewayIndentifyData {
  /**
   * The token of the client
   * @var string
   */
  token: string;
  /**
   * The properties object
   * @var GatewayPropertiesData
   */
  properties: GatewayPropertiesData;
  /**
   * whether this connection supports compression of packets
   * @var boolean	
   * @default false
   */
  compress?: boolean;
  /**
   * 	value between 50 and 250, total number of members where the gateway will stop sending offline members in the  *  guild member list
   * @var number
   * @default 50
   */
  large_threshold?: number;
  /**
   * Array of two numbers (shar_id, num_shards) used for GuildSharding
   * @var number[]
   */
  shard?: number[];
  /**
   * The presence of the client user
   * @var Presence
   */
  presence?: UserPresence;
  /**
   * The Gateway intents you wish to receive
   * @var number
   */
  intents: number;
}

export interface GatewayPropertiesData {
  /**
   * The operating system
   * @var string
   */
  '$os': string;
  /**
   * The library name
   * @var string
   * @default 'Discord.types'
   */
  '$browser': string;
  /**
   * The library name
   * @var stringify
   * @default 'Discord.types'
   */
  '$device': string;
}