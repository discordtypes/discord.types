import { DiscordSnowflake, Snowflake } from "./Utils/Snowflake";

//BASE
export function BASE_API_VERSION(): number {
  return 9 as const;
}
export function BASE_URL(apiVersion: number): string{
  return "https://discord.com/v" + apiVersion;
}

/**
 * Return a major route id
 * Exemple: toMajorRoute('/channels/886631972233949286') must return '/channels/:id'
 * 
 * @param string routeId
 * @return string
 */
export function toMajorRoute(routeId: string): string {
  return routeId.replace(/\d{16,19}/g, ':id').replace(/\/reactions\/(.*)/, '/reactions/:reaction');
}