<template>
  <v-btn-toggle
    class="date-time-range-preset-buttons"
    dense
    :value="value"
  >
    <v-btn
      text
      :outlined="isActive(preset.DAY)"
      :color="isActive(preset.DAY) ? 'accent' : undefined"
      @click="onClick(preset.DAY)"
    >
      Day
    </v-btn>
    <v-btn
      text
      :outlined="isActive(preset.WEEK)"
      :color="isActive(preset.WEEK) ? 'accent' : undefined"
      @click="onClick(preset.WEEK)"
    >
      Week
    </v-btn>
    <v-btn
      text
      :outlined="isActive(preset.MONTH)"
      :color="isActive(preset.MONTH) ? 'accent' : undefined"
      @click="onClick(preset.MONTH)"
    >
      Month
    </v-btn>
    <v-btn
      text
      :outlined="isActive(preset.ALL)"
      :color="isActive(preset.ALL) ? 'accent' : undefined"
      @click="onClick(preset.ALL)"
    >
      All
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';

export enum DateTimeRangePreset {
  DAY,
  WEEK,
  MONTH,
  ALL,
}

export default Vue.extend({
  name: 'DateTimeRangePresetButtons',
  props: {
    value: {
      type: Number,
      default: null,
    } as PropOptions<number | null>,
  },
  data() {
    return {
      activePreset: 0,
      preset: DateTimeRangePreset,
    };
  },
  methods: {
    isActive(preset: DateTimeRangePreset): boolean {
      return this.value === preset;
    },
    onClick(preset: DateTimeRangePreset): void {
      this.$emit('input', preset);
      this.$emit('click', preset);
    },
  },
});
</script>

<style lang="scss">
</style>
