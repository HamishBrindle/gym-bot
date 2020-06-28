<template>
  <div class="settings__wrapper">
    <div class="settings">
      <v-row>
        <v-col>
          <span class="display-1 font-weight-light">Settings</span>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card
            class="mx-auto"
            elevation="0"
            outlined
          >
            <v-list-item three-line>
              <v-list-item-content>
                <div class="overline mb-4">
                  GENERAL
                </div>
                <v-list-item-title class="headline mb-1">
                  Light/Dark Mode
                </v-list-item-title>
                <v-list-item-subtitle>
                  Change the look and feel of the dashboard (turn out the lights!)
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-switch
                v-model="isDarkTheme"
                hide-details
                inset
                color="accent"
              />
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { Sync } from 'vuex-pathify';

@Component({
  name: 'Settings',
})
export default class Settings extends Vue {
  @Sync('context/theme@dark')
  isDarkTheme!: boolean;
}
</script>

<style lang="scss">
.settings {}
</style>
