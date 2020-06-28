<template>
  <v-app-bar
    app
    clipped-left
    color="primary"
    dark
  >
    <v-app-bar-nav-icon @click.stop="onToggleDrawer(!drawer)" />
    <v-toolbar-title>
      <router-link
        v-slot="{ navigate }"
        :to="{ name: 'home' }"
      >
        <span
          class="logo"
          @click="navigate"
        >
          GymBot
        </span>
      </router-link>
    </v-toolbar-title>
    <v-spacer />

    <!-- User Icon -->
    <v-menu
      bottom
      left
    >
      <template v-slot:activator="{ on }">
        <v-btn
          dark
          icon
          v-on="on"
        >
          <v-icon>{{ userMenu.logo }}</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-list>
          <v-subheader>Account Options</v-subheader>
          <v-list-item>
            <v-list-item-avatar>
              <v-icon x-large>
                mdi-account
              </v-icon>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ `${user.firstName}` `${user.lastName}` || '??' }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email || '??' }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-actions>
          <v-spacer />
          <v-btn
            v-for="item in userMenu.items"
            :key="item.label"
            :color="item.color"
            text
            @click="onMenuOptionClick(item.action)"
          >
            {{ item.title }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </v-app-bar>
</template>

<script>
import User from '@/models/User';

export default {
  props: {
    value: Boolean,
  },
  data() {
    return {
      drawer: this.value,
      userMenu: {
        logo: 'mdi-account',
        items: [
          {
            title: 'Settings',
            action: 'user-settings',
            color: 'primary',
          },
          {
            title: 'Logout',
            action: 'user-logout',
            color: 'red',
          },
        ],
      },
    };
  },
  computed: {
    user() {
      return User.getActive();
    },
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
    onMenuOptionClick(option) {
      switch (option) {
      case 'user-settings': {
        const currentRoute = this.$route.name;
        if (currentRoute !== 'settings') {
          this.$router.push({ name: 'settings' });
        }
        break;
      }
      case 'user-logout': {
        this.$router.push({ name: 'logout' });
        break;
      }
      default: {
        break;
      }
      }
    },
  },
};
</script>

<style lang="scss">
.logo {
  opacity: 1;
  transition: opacity 150ms ease-in-out;

  &:hover {
    cursor: pointer;
    opacity: 0.7;
  }
}
</style>
