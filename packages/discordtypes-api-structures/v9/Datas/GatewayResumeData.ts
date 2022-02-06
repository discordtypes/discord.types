export interface GatewayResumeData {
  /**
   * The token of the client
   * @var string
   */
  token: string;
  /**
   * The session id fount in the Ready Event
   * @var string
   */
  session_id: string;
  /**
   * The last sequence number received
   * @var number
   */
  seq: number;
}