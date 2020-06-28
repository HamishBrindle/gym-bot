import { Model } from '@vuex-orm/core';
import { Item, InstanceOf } from '@/lib/types';

export class BaseModel extends Model {
  /**
   * State data for each entity.
   *
   * @returns {object} State
   */
  static state() {
    return {
      reading: false,
      writing: false,
      active: '',
    };
  }

  /**
   * Toggle the reading flag on/off
   *
   * @returns {boolean} Is reading
   */
  static get reading() {
    const { entity } = this;
    return this.store().state.entities[entity].reading;
  }

  /**
   * Set the reading flag for this model.
   *
   * @param {boolean} value Reading flag value
   */
  static set reading(value) {
    this.commit((state) => {
      state.reading = value;
    });
  }

  /**
   * Toggle the writing flag on/off
   *
   * @returns {boolean} Is writing
   */
  static get writing() {
    const { entity } = this;
    return this.store().state.entities[entity].writing;
  }

  /**
   * Set the writing flag for this model.
   *
   * @param {boolean} value Writing flag value
   */
  static set writing(value) {
    this.commit((state) => {
      state.writing = value;
    });
  }

  /**
   * Get the unique identifier of the active model.
   *
   * @returns {string} Unique identifier (primary key)
   */
  static get active() {
    const { entity } = this;
    const { active } = this.store().state.entities[entity];
    if (!active) {
      return null;
    }
    return active;
  }

  /**
   * Set the unique identifier of the active model.
   *
   * @param {string} value Unique identifier (primary key)
   */
  static set active(value) {
    this.commit((state) => {
      state.active = value;
    });
  }

  /**
   * Get the active record of this Model
   */
  static getActive<T extends typeof BaseModel>(this: T, includes: Array<string> = []): Item<InstanceOf<T>> {
    const query = this.query().whereId(this.active);

    if (Array.isArray(includes)) {
      includes.forEach((include) => {
        if (Array.isArray(include) && include.length === 2) {
          const [association, fn] = include;
          query.with(association, fn);
        }

        query.with(include);
      });
    } else if (typeof includes === 'string') {
      query.with(includes);
    }

    return query.first();
  }

  /**
   * Set the active record of this Model
   */
  static setActive<T extends typeof BaseModel>(this: T, record: (InstanceOf<T> | string | number)): Item<InstanceOf<T>> {
    if (!record) {
      this.active = '';
      return null;
    }

    if (typeof record === 'string' || typeof record === 'number') {
      this.active = record;
      return this.getActive();
    }

    this.active = record?.$id;
    return this.getActive();
  }
}

export default BaseModel;
