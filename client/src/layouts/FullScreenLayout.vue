<template>
  <v-content>
    <v-container
      class="fill-height"
      fluid
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <slot />
      </transition>
      <v-footer app>
        <span>{{ applicationName }} &copy; {{ year }}</span>
      </v-footer>
    </v-container>
  </v-content>
</template>

<script lang="ts">
import Vue from 'vue';
import constants from '@/constants.json';

export default Vue.extend({
  name: 'FullScreenLayout',
  data: () => ({
    applicationName: constants.appName,
    year: new Date().getFullYear(),
  }),
});
</script>
