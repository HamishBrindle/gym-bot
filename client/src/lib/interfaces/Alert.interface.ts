export interface IAlert {
  /**
   * Type of alert
   */
  type?: 'info' | 'success' | 'error' | 'warning';

  /**
   * Alert is visible
   */
  value: boolean;

  /**
   * Array of strings to inside the alert
   */
  messages: string[];
}
