<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    :width="356"
    @input="onToggleDrawer"
  >
    <v-row>
      <v-col>
        <div class="typeface">
          GymBot
        </div>
      </v-col>
    </v-row>
    <v-divider />
    <navigation-items>
      <template v-for="(item, i) in navItems">
        <v-divider
          v-if="!!item.divider"
          :key="i"
        />
        <navigation-item
          v-if="canAccessItem() && !!item.to"
          :key="item.to"
          :to="item.to"
          :params="item.params"
          :title="item.title"
          :action="item.action"
        />
        <template v-else-if="canAccessItem()">
          <v-list-group
            :key="item.title"
            color="grey"
            class="darken-2"
            :prepend-icon="item.action"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </template>

            <navigation-item
              v-for="subItem in item.items"
              :key="subItem.to"
              class="navigation-drawer__child-item"
              :to="subItem.to"
              :params="subItem.params"
              :title="subItem.title"
              :action="subItem.action"
            />
          </v-list-group>
        </template>
      </template>
    </navigation-items>
  </v-navigation-drawer>
</template>

<script>
import NavigationItems from '@/components/NavigationDrawer/NavigationItems.vue';
import NavigationItem from '@/components/NavigationDrawer/NavigationItem.vue';
import links from '@/components/NavigationDrawer/links';

export default {
  name: 'NavigationDrawer',
  components: {
    'navigation-items': NavigationItems,
    'navigation-item': NavigationItem,
  },
  props: {
    value: Boolean,
    navItems: {
      type: Array,
      default: () => links,
    },
  },
  data() {
    return {
      drawer: this.value,
      selected: '',
    };
  },
  watch: {
    value(v) {
      this.drawer = v;
    },
  },
  methods: {
    onToggleDrawer(isOpen) {
      this.$emit('input', isOpen);
    },
    onItemClick(event, item) {
      if (event) {
        this.selected = item;
      }
    },
    canAccessItem() {
      return true;
    },
  },
};
</script>

<style lang="scss">
.typeface {
  width: 12rem;
  margin: 1rem 1rem 1rem 1rem;
}
.navigation-drawer {
  &__child-item {
    padding-left: 2rem;
  }
}
</style>
