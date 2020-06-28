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
      <div class="dashboard-login__wrapper">
        <div class="dashboard-login">
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <span class="headline">Login</span>
              <v-spacer />
              <v-toolbar-title>{{ applicationName }}</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form
                v-model="form.valid"
              >
                <v-text-field
                  v-model="form.email"
                  label="Login"
                  name="login"
                  :rules="[form.rules.required, form.rules.email]"
                  prepend-icon="mdi-account"
                  type="text"
                  @keyup="onKeyup"
                />
                <v-text-field
                  id="password"
                  ref="password"
                  v-model="form.password"
                  label="Password"
                  name="password"
                  :rules="[form.rules.required, form.rules.counter]"
                  prepend-icon="mdi-lock"
                  type="password"
                  @keyup="onKeyup"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                :disabled="!form.valid"
                :loading="isLoggingIn"
                color="primary"
                text
                depressed
                large
                @click="login"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-snackbar
            v-model="isSnackbarVisible"
            class="dashboard-login__snackbar"
            top
            color="error"
          >
            <v-icon>mdi-alert-circle</v-icon>
            Login Error: {{ error }}
          </v-snackbar>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import constants from '@/constants.json';
import { User } from '@/models/User';
import { UserService } from '@/services';

export default Vue.extend({
  data() {
    return {
      form: {
        email: '',
        password: '',
        valid: false,
        rules: {
          required: (value: string) => !!value || 'Required.',
          counter: (value: string) => value.length >= 5 || 'Invalid password',
          email: (value: string) => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Invalid e-mail';
          },
        },
      },
      applicationName: constants.appName,
      error: '',
      isSnackbarVisible: false,
      isLoggingIn: false,
    };
  },
  methods: {
    /**
     * When enter key pressed in login form: focus password input, or login.
     * @e KeyboardEvent
     */
    onKeyup(e: KeyboardEvent) {
      if (e.key !== 'Enter') {
        return;
      }
      if ((e.target as HTMLElement).id === 'password') {
        this.login();
        return;
      }
      (this.$refs.password as any).focus(); // eslint-disable-line @typescript-eslint/no-explicit-any
    },
    /**
     * Login and navigate to home.
     */
    async login() {
      if (!this.form.valid) {
        return;
      }

      this.isLoggingIn = true;
      try {
        const credentials = {
          email: this.form.email,
          password: this.form.password,
        };

        const userService = UserService.getInstance();
        const { data: loginData } = await userService.api.login(credentials);

        console.log('loginData :>> ', loginData);

        const { data: userData } = await userService.api.me({ accessToken: loginData.accessToken });

        console.log('userData :>> ', userData);

        const user = {
          ...userData,
          ...loginData,
        };

        console.log('user :>> ', user);

        await userService.create({
          data: user,
        });

        User.setActive(userData.id);

        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error(error);
        this.error = error.message;
        this.isSnackbarVisible = true;
        setTimeout(() => {
          this.isLoggingIn = false;
        }, 1000);
      }
    },
  },
});
</script>

<style lang="scss">
.dashboard-login {
  &__snackbar {
    // moves snackbar some 25% down on full height
    height: 50%;

    & .v-icon {
      margin-right: 0.5rem;
    }

    & .v-snack__content {
      // left align text (defaults to space-between)
      justify-content: start;
    }
  }
}
</style>
