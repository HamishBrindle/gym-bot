<template>
  <v-menu
    v-model="datePicker"
    :close-on-content-click="false"
    :nudge-right="37"
    transition="scale-transition"
    offset-y
    min-width="290px"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="dateRangeText"
        class="date-time-range-picker__date-range-input"
        prepend-icon="mdi-calendar"
        append-icon="mdi-reload"
        label="Date Range"
        readonly
        v-on="on"
        @click="onClickOpenDatePicker"
        @click:prepend="onClickOpenDatePicker"
        @click:append="onClickReload"
      />
    </template>
    <v-date-picker
      v-model="dates"
      range
      landscape
      no-title
      scrollable
      :allowed-dates="allowedDates"
    >
      <v-menu
        ref="menu"
        v-model="timePicker"
        :close-on-content-click="false"
        :return-value.sync="time"
        transition="scale-transition"
        offset-y
        :nudge-right="-17"
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-model="timeText"
            class="date-time-range-picker__time-input"
            label="Start/End Time"
            readonly
            v-on="on"
          />
        </template>
        <v-time-picker
          v-if="timePicker"
          v-model="time"
          no-title
          scrollable
          full-width
          @click:minute="$refs.menu.save(time)"
        />
      </v-menu>
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="onClickUpdateDateTimeRange"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import moment from 'moment';
import dateTimeRangeCalculator, { DateTimeRange } from '@/lib/DateTimeRangeCalculator';

export default Vue.extend({
  name: 'DateTimeRangePicker',
  props: {
    value: {
      type: Object,
      required: true,
    } as PropOptions<DateTimeRange>,
    timezoneText: {
      type: String,
      default: 'PDT',
    } as PropOptions<string>,
  },
  data() {
    return {
      datePicker: false,
      dates: ['', ''],
      datesConfirmed: ['', ''],
      timePicker: false,
      time: '',
      timeConfirmed: '',
    };
  },
  computed: {
    dateRangeText(): string {
      return `${this.datesConfirmed.join(' ~ ')} ${this.timeConfirmed} ${this.timezoneText}`;
    },
    timeText(): string {
      return `${this.time} ${this.timezoneText}`;
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(newValue) {
        this.datePicker = false;
        this.dates = [newValue.startDate, newValue.endDate];
        this.datesConfirmed = [newValue.startDate, newValue.endDate];
        this.timePicker = false;
        this.time = newValue.startEndTime;
        this.timeConfirmed = newValue.startEndTime;
      },
    },
  },
  methods: {
    allowedDates(date: string): boolean {
      return moment(date).isBetween(dateTimeRangeCalculator.FIRST_DAY, moment(), undefined, '[]');
    },
    onClickOpenDatePicker(): void {
      this.datePicker = true;
      this.timePicker = false;
      this.dates = this.datesConfirmed;
      this.time = this.timeConfirmed;
    },
    onClickUpdateDateTimeRange(): void {
      this.datePicker = false;
      this.timePicker = false;
      this.dates = this.sortDates(this.dates);
      this.datesConfirmed = this.dates;
      this.timeConfirmed = this.time;
      const dateTimeRange = {
        startDate: this.datesConfirmed[0],
        endDate: this.datesConfirmed[1],
        startEndTime: this.timeConfirmed,
      };
      this.$emit('input', dateTimeRange);
    },
    onClickReload(): void {
      this.$emit('click:reload');
    },
    sortDates(dates: string[]): string[] {
      let start = moment(dates[0]);
      let end = moment(dates[dates.length - 1]);

      // swap start/end; start > end
      if (start.diff(end, 'd') > 0) {
        const newEnd = start;
        start = end;
        end = newEnd;
      }

      return [start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD')];
    },
  },
});
</script>

<style lang="scss">
.date-time-range-picker {
  &__date-range-input {
    width: 330px;
    max-width: 330px;
  }

  &__time-input {
    margin-left: 9px;
  }
}
</style>
