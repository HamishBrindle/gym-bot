<template>
  <div class="home__wrapper">
    <v-container class="home">
      <v-row>
        <v-col>
          <span class="display-1 font-weight-light">Overview</span>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import constants from '@/constants.json';

export default {
  name: 'Home',
  data() {
    return {
      applicationName: constants.appName,
    };
  },
};
</script>
