<template>
  <v-list-item
    class="info-list-item"
  >
    <v-list-item-icon>
      <v-icon color="primary">
        {{ item.icon }}
      </v-icon>
    </v-list-item-icon>

    <v-list-item-content>
      <v-list-item-title v-html="item.value" />
      <v-list-item-subtitle>{{ item.label }}</v-list-item-subtitle>
    </v-list-item-content>
  </v-list-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { InfoListItem as InfoListItemType } from '@/lib/types/InfoList.type';

@Component({
  name: 'InfoListItem',
})
export default class InfoListItem extends Vue {
  @Prop({ required: true, default: () => ({}) })
  private readonly item!: InfoListItemType;
}
</script>

<style lang="scss">
// .info-list-item {}
</style>
