import { defineAbility, Ability as CaslAbility } from '@casl/ability';
import User from '@/models/User';

export class AbilityService {

  /**
   * Cached instance of the service
   */
  private static instance: AbilityService | null = null;

  /**
   * Get an instance of the CustomerService
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new AbilityService();
      return this.instance;
    }
    return this.instance;
  }

  /**
   * Define the abilities available to a User that can be checked
   * throughout the application.
   * @param user
   */
  public static defineAbilitiesFor(user: User) {
    if (!user) {
      return new CaslAbility();
    }

    return defineAbility((can) => {
      can('read', 'all');
      can('update', 'all');
      can('create', 'all');
      can('destroy', 'all');
    });
  }
}

/**
 * Define abilities for a given User
 */
export default AbilityService.defineAbilitiesFor;
