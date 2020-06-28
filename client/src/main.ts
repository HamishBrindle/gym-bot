import Vue from 'vue';
import CustomVuex from '@/store';
import router from '@/router';
import vuetify from '@/plugins/vuetify';
import defineAbilitiesFor from '@/services/AbilityService';
import { abilitiesPlugin } from '@casl/vue';
import App from './App.vue';
import 'reflect-metadata';
import '@/registerServiceWorker';
import User from './models/User';

Vue.config.productionTip = false;

async function start() {
  try {
    // Initialize abilities to nothing before fetching User from server
    Vue.use(abilitiesPlugin, defineAbilitiesFor(new User()));

    Vue.use(CustomVuex);

    const store = await CustomVuex.init();

    new Vue({
      router,
      store,
      vuetify,
      render: (h) => h(App),
    }).$mount('#app');
  } catch (error) {
    console.error('Unable to start application:', error);
  }
}

start();
