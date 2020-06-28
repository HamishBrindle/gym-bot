<template>
  <div class="info-list-section__wrapper">
    <div class="info-list-section">
      <slot name="before" />
      <v-row>
        <!-- One column for each of the Customer's info categories -->
        <v-col
          v-for="({ label, items }, i) in sections"
          :key="i"
          sm="12"
          lg="6"
        >
          <info-list
            :items="items"
            :label="label"
          />
        </v-col>
      </v-row>
      <slot name="after" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { InfoListSection } from '@/lib/types/InfoList.type';
import InfoList from '@/components/InfoList/InfoList.vue';

@Component({
  name: 'InfoListSections',
  components: {
    InfoList,
  },
})
export default class InfoListSections extends Vue {
  @Prop({ required: true, default: () => ({}) })
  private readonly sections!: InfoListSection[]
}
</script>

<style lang="scss">
// .info-list-section {}
</style>
