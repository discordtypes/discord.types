export class RestError extends Error {
  /**
   * RestError constructor
   * @param string message
   * @param number code
   */
  public constructor(message: string, code: number = 0){
    super(`RestError: ${message}: ${code}`)
  }
}