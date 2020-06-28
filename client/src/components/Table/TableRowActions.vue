<template>
  <div class="table-actions__wrapper">
    <div class="table-actions">
      <!-- View a record in a different view -->
      <template v-if="view && canRead()">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              color="accent"
              text
              fab
              small
              v-on="on"
              @click="view(record)"
            >
              <v-icon>mdi-eye-outline</v-icon>
            </v-btn>
          </template>
          <span>View</span>
        </v-tooltip>
      </template>

      <!-- Edit a record in a different view -->
      <template v-if="edit && canUpdate()">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              color="blue"
              text
              fab
              small
              v-on="on"
              @click="edit(record)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>Edit</span>
        </v-tooltip>
      </template>

      <!-- Approve status of record -->
      <template v-if="approve && canUpdateStatus()">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              color="green"
              text
              fab
              small
              v-on="on"
              @click="approve(record)"
            >
              <v-icon>mdi-clipboard-check</v-icon>
            </v-btn>
          </template>
          <span>Approve</span>
        </v-tooltip>
      </template>

      <!-- Deny status of record -->
      <template v-if="deny && canUpdateStatus()">
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn
              color="red"
              text
              fab
              small
              v-on="on"
              @click="deny(record)"
            >
              <v-icon>mdi-close-circle</v-icon>
            </v-btn>
          </template>
          <span>Deny</span>
        </v-tooltip>
      </template>

      <template>
        <slot />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { User } from '@/models/User';
import { Item, InstanceOf } from '@/lib/types';
import BaseModel from '@/models/BaseModel';

@Component({
  name: 'TableRowActions',
})
export default class TableRowActions extends Vue {
  /**
   * A record as a data table row
   */
  @Prop({ required: true })
  readonly record!: BaseModel;

  /**
   * Callback for when `edit` button is clicked
   */
  @Prop({ default: false })
  readonly view!: (record: InstanceOf<BaseModel>) => Promise<any> | boolean;

  /**
   * Callback for when `edit` button is clicked
   */
  @Prop({ default: false })
  readonly edit!: (record: InstanceOf<BaseModel>) => Promise<any> | boolean;

  /**
   * Callback for when `approve` button is clicked
   */
  @Prop({ default: false })
  readonly approve!: (record: InstanceOf<BaseModel>) => Promise<any> | boolean;

  /**
   * Callback for when `deny` button is clicked
   */
  @Prop({ default: false })
  readonly deny!: (record: InstanceOf<BaseModel>) => Promise<any> | boolean;

  /**
   * Active User
   */
  private user: Item<User> = User.getActive();

  /**
   * Model type used in list
   */
  private recordType = this.record.constructor.name;

  /**
   * Active user is allowed to read records from this model
   */
  private canRead() {
    return this.$ability.can('read', this.recordType);
  }

  /**
   * Active user is allowed to update records from this model
   */
  private canUpdate() {
    return this.$ability.can('update', this.recordType);
  }

  /**
   * Active user is allowed to update the status of records from this model
   */
  private canUpdateStatus() {
    return this.$ability.can('updateStatus', this.recordType);
  }
}
</script>

<style lang="scss">
</style>
