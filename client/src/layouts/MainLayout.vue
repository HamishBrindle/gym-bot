<template>
  <div class="main-layout fill-height">
    <!-- Navigation -->
    <navigation-drawer v-model="drawer" />
    <app-bar v-model="drawer" />

    <!-- Dashboard Body -->
    <v-content>
      <v-container class="main-layout__body">
        <transition
          name="fade"
          mode="out-in"
        >
          <slot />
        </transition>
      </v-container>
    </v-content>

    <v-footer app>
      <span>{{ applicationName }} &copy; {{ year }}</span>
    </v-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer.vue';
import AppBar from '@/components/AppBar/AppBar.vue';
import constants from '@/constants.json';

export default Vue.extend({
  name: 'MainLayout',
  components: {
    'navigation-drawer': NavigationDrawer,
    'app-bar': AppBar,
  },
  data: () => ({
    drawer: false,
    applicationName: constants.appName,
    year: new Date().getFullYear(),
  }),
});
</script>

<style lang="scss">
.main-layout {
  // Our app really doesn't need to stretch all the way
  // across the screen
  &__body {
    max-width: 71.25rem;
  }
}

</style>
