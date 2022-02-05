//TYPES

import { IRouteData } from "./IRouteData";

/**
 * A type like a rout
 */
 export type RouteLike = `/${string}`

//BASE
export function BASE_API_VERSION(): number {
  return 9 as const;
}
export function BASE_URL(): string{
  return "https://discord.com/api";
}

//Gateway
export function GET_GATEWAY_BOT(): RouteLike {
  return '/gateway/bot' as const;
}
export function GET_GATEWAY_BEARER(): RouteLike {
  return '/gateway' as const;
}

/**
 * Return a major route id
 * Exemple: toMajorRoute('/channels/886631972233949286') must return '/channels/:id'
 * 
 * @param string routeId
 * @return string
 */
export function resolveRouteData(routeId: RouteLike): IRouteData {
  return {
    fullroute: routeId,
    bucketRoute: routeId.replace(/\d{16,19}/g, ':id').replace(/\/reactions\/(.*)/, '/reactions/:reaction'),
    majorParameter: /^\/(channels|guilds|wehbhooks)\/(\d{16, 19})/.exec(routeId)?.[1] ?? 'global'
  };
}