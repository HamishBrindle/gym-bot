<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col
      cols="12"
      sm="8"
      md="4"
    >
      <div class="error-page__wrapper">
        <div class="error-page">
          <v-card>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="error-page__code headline">
                  {{ code }}
                </v-list-item-title>
                <v-list-item-subtitle>{{ reason }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text>
              <div class="error-page__message">
                {{ message }}
              </div>
            </v-card-text>
            <v-card-actions>
              <div class="error-page__cta">
                <router-link
                  v-slot="{ href, route, navigate }"
                  :to="{ name: 'home' }"
                >
                  <v-btn
                    color="primary"
                    text
                    depressed
                    large
                    :href="href"
                    @click="navigate"
                  >
                    Go Home
                  </v-btn>
                </router-link>
              </div>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
/* eslint-disable vue/require-default-prop */

import Vue from 'vue';

export default Vue.extend({
  name: 'Error',
  props: {
    code: [Number, String],
    reason: String,
    message: String,
  },
});
</script>

<style lang="scss">
.error-page {
  &__cta {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }
}
</style>
