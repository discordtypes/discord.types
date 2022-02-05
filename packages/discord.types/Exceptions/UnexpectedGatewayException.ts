export class UnexpectedGatewayException extends Error{
   /**
   * UnexpectedGatewayException constructor
   * @param string message
   * @param number code
   */
    public constructor(message: string, code: number = 0){
      super(`UnexpectedGatewayException: ${message} \n Code: ${code}`)
    }
}