export interface ClientStatusData {
  /**
   * the user's status set for an active desktop (Windows, Linux, Mac) application session
   * @var string
   */
  desktop?: string;
  /**
   * the user's status set for an active mobile (iOS, Android) application session
   * @var string
   */
  mobile?: string;
  /**
   * the user's status set for an active web (browser, bot account) application session
   * @var string
   */
  web?: string;
}