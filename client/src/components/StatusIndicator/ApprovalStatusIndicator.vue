<template>
  <span class="approval-status-indicator d-flex align-center">
    <div
      v-if="$slots.prepend"
      class="approval-status-indicator__prepend pr-2 body-2"
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
      class="approval-status-indicator__append pl-2 body-2"
    >
      <slot name="append" />
    </div>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ApprovalStatus } from '@/lib/enum';
import util from '@/tools/Utilities';

@Component({
  name: 'ApprovalStatusIndicator',
})
export default class ApprovalStatusIndicator extends Vue {
  /**
   * Status used to render status indicator
   */
  @Prop({ required: true, default: ApprovalStatus.Pending })
  status!: ApprovalStatus;

  /**
   * Get class-name of the status indicator based on status
   */
  getClassObject(status: ApprovalStatus) {
    return {
      'text--darken-2': true,
      'green--text': !status || status === ApprovalStatus.Approved,
      'yellow--text': status === ApprovalStatus.Pending,
      'red--text': status === ApprovalStatus.Denied,
    };
  }

  /**
   * Format status label for the status indicator's tooltip
   */
  formatStatus(status: string) {
    if (!status) {
      return util.titleCase(ApprovalStatus.Approved);
    }
    return util.titleCase(status);
  }
}
</script>

<style lang="scss">
.approval-status-indicator {
  display: flex;
}
</style>
