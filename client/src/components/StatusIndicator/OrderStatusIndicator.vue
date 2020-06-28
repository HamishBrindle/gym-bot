<template>
  <span class="order-status-indicator d-flex align-center">
    <div
      v-if="$slots.prepend"
      class="order-status-indicator__prepend pr-2 body-2"
    >
      <slot name="prepend" />
    </div>
    <v-tooltip left>
      <template v-slot:activator="{ on }">
        <v-icon
          :class="getClassObject(status)"
          v-on="on"
        >
          mdi-checkbox-blank-circle
        </v-icon>
      </template>
      <span>{{ formatStatus(status) }}</span>
    </v-tooltip>

    <div
      v-if="$slots.append"
      class="order-status-indicator__append pl-2 body-2"
    >
      <slot name="append" />
    </div>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { OrderStatus } from '@/lib/enum';
import util from '@/tools/Utilities';

@Component({
  name: 'OrderStatusIndicator',
})
export default class OrderStatusIndicator extends Vue {
  /**
   * Status used to render status indicator
   */
  @Prop({ required: true, default: OrderStatus.Submitted })
  status!: OrderStatus;

  /**
   * Get class-name of the status indicator based on status
   */
  getClassObject(status: OrderStatus) {
    return {
      'gray--text text--darken-2': !status,
      'yellow--text text--darken-2': status ===  OrderStatus.Submitted,
      'cyan--text': status === OrderStatus.Vetted,
      'green--text text--darken-2': status === OrderStatus.Approved,
      'red--text text--darken-2': status === OrderStatus.Denied,
      'green--text text--darken-5': status === OrderStatus.Complete,
    };
  }

  /**
   * Format status label for the status indicator's tooltip
   */
  formatStatus(status: string) {
    if (!status) {
      return util.titleCase(OrderStatus.Submitted);
    }
    return util.titleCase(status);
  }
}
</script>

<style lang="scss">
.order-status-indicator {
  display: flex;
}
</style>
