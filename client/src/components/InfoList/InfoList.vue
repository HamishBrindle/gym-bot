<template>
  <v-list
    two-line
    max-width="40rem"
    class="info-list"
  >
    <v-subheader v-if="label">
      {{ label }}
    </v-subheader>

    <!-- For all the customer and contact info data -->
    <template
      v-for="(item, j) in items"
    >
      <info-list-item
        :key="item.label"
        :item="item"
      />

      <v-divider
        v-if="!item.siblings && item.divider"
        :key="j"
        inset
      />

      <!-- Nested list items for related info data -->
      <template
        v-if="item.siblings"
      >
        <info-list-item
          v-for="sibling in item.siblings"
          :key="sibling.label"
          :item="sibling"
        />

        <v-divider
          v-if="item.divider"
          :key="j"
          inset
        />
      </template>
    </template>
  </v-list>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import InfoListItem from '@/components/InfoList/InfoListItem.vue';
import {
  InfoList as InfoListType,
} from '@/lib/types/InfoList.type';

@Component({
  name: 'InfoList',
  components: {
    InfoListItem,
  },
})
export default class InfoList extends Vue {
  @Prop({ required: true, default: () => ([]) })
  private readonly items!: InfoListType;

  @Prop({ required: false, default: '' })
  private readonly label!: string;
}
</script>

<style lang="scss">
// .info-list {}
</style>
