import EventEmitter from "./EventEmiter";
import * as Routes from '../typescord-api-structures/v9/'

export interface RateLimit {
  /** 
   * If the rate limit is global or not
   * @var number
   */
  global?: boolean;

  /**
   *  When the rate limit is reset
   * @var number
   */
  reset_after: number;
}

export class Rest extends EventEmitter<{
  //Used for debug
  debug,
}>{

  /**
   * The base url api to send requests
   * @var string
   */
  public BASE_URL: string;

  /**
   * The authorization token needs to access to the api
   * @var string
   */
  #token: string;

  public constructor(token: string = null, apiVersion: number = Routes.BASE_API_VERSION()){
    super();
    this.#token = token;
    this.BASE_URL
     = Routes.BASE_URL(apiVersion);
  }
}

