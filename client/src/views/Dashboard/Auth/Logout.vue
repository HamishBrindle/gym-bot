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
      <div class="logout__wrapper">
        <div class="logout">
          <v-card>
            <v-list-item two-line>
              <v-list-item-content>
                <v-list-item-title class="display-1 font-weight-light">
                  Logged Out
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider />
            <v-card-text>
              <div>You've successfully logged out. <span class="font-weight-bold">Great work today</span>, we'll see you again soon!</div>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <router-link
                v-slot="{ href, route, navigate }"
                :to="{ name: 'login' }"
              >
                <v-btn
                  color="primary"
                  text
                  depressed
                  large
                  :href="href"
                  @click="navigate"
                >
                  Login
                </v-btn>
              </router-link>
            </v-card-actions>
          </v-card>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import User from '@/models/User';

export default {
  beforeCreate() {
    User.deleteAll();
  },
};
</script>
