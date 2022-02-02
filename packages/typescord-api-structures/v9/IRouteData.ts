import { RouteLike } from ".";

export interface IRouteData {
  /**
   * The fullroute string
   * @var string 
  */
 fullroute: RouteLike;
 /**
  * A fullroute to major route.
  * Example: the fullroute: /channels/89767785647457 will be /channels/:id
  * @var string
  */
 bucketRoute: string;
 /**
  * The major parameters in the fullroute
  * @var any
  */
 majorParameters: any;
}