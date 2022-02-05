export class InvalidTokenException extends Error {
  /**
   * InvalidTokenExceptions constructor
   * @param string message
   * @param number code
   */
  public constructor(message: string, code: number = 0){
    super(`InvalidTokenException: ${message} \n Code: ${code}`)
  }
}