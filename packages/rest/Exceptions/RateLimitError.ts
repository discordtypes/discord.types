export class RateLimitError extends Error {
  /**
   * RateLimitError constructor
   * @param string message
   * @param number code
   */
  public constructor(message: string, code: number = 0){
    super(`RateLimitError: ${message}: ${code}`)
  }
}