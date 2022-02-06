export interface GatewayDispatchData {
  /**
   * The OP code
   * @var number
   */
  op: number;
  /**
   * The event data
   * @var any
   */
  d: any;
  /**
   * the sequence number
   * @var number
   */
  s: number|null;
  /**
   * The event name for this payload
   * @var string
   */
  t: string|null;
}