import {GET_GATEWAY_BEARER, GET_GATEWAY_BOT} from '../../discordtypes-api-structures/v9'
import {WebSocket} from 'ws';
import { UnexpectedGatewayException } from '../Exceptions';
import { InvalidTokenException } from "../Exceptions/InvalidTokenException";
import { Client } from "./";

export class Gateway {

  /**
   * The client class
   * @var Client
   */
  #client: Client;

  /**
   * The WebSocket client
   * @var WebSocket
   */
  public websocket: WebSocket;

  /**
   * Gateway constructor
   * @param Client client
   */
  public constructor(client: Client){
    this.#client = client;
  }
  
  /**
   * Connect the gateway
   */
  public async connect() {
    if(!this.#client.token) throw new InvalidTokenException(`Please provide a token to connect the bot.`);

    var req = await this.#client.api.get(this.#client.options.authPrefix === 'Bot' ? GET_GATEWAY_BOT() : GET_GATEWAY_BEARER());

    let url: string;

    if(!req) {
      url = 'wss://gateway.discord.gg/'
      this.#client.debug('Cannot get WebSocket by send a request to the api. Use the url stored in cache, it\'s not advised.')
    }
    else url = req.url

    this.initWs(url)
  }

  /**
   * Init the websocket
   * @param string url
   */
  private initWs(url: string) {
    var websocket = new WebSocket(url)
    websocket.on('open', () => this.onWsOpen())
    websocket.on('message', (d) => this.onWsMessage(d))
    websocket.on('close', (code: number, reason: string) => this.onWsClose(code, reason))
    websocket.on('error', (error: string) => this.onWsError(error))
    this.websocket = websocket
  }

  /**
   * OnOpen WebSocket event
   */
  private onWsOpen(){
    this.#client.debug('WebSocket connection has been etablished.')
  }

  /**
   * OnMessage WebSocket event
   * @param any d
   */
  private onWsMessage(d){
    //ToDo: Handle ws messages
  }

  /**
   * OnClose WebSocket event
   * @param number code
   * @param string reason
   */
  public onWsClose(code: number, reason: string){
    this.#client.debug(`The websocket has closed with ${code} error code for ${reason}.`)
    //ToDo: Resuming
  }

  /**
   * OnError WebSocket event
   * @param string error
   */
  public onWsError(error: string){
    throw new UnexpectedGatewayException(error);
  }
}