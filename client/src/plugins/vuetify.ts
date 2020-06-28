import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';
import { Ripple } from 'vuetify/lib/directives';

Vue.use(Vuetify, {
  directives: {
    Ripple,
  },
});

export default new Vuetify({
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#0077B2',
        secondary: '#CDDC39',
        accent: '#843275',
        error: '#F44336',
        warning: '#FFC107',
        info: '#607D8B',
        success: '#4CAF50',
        background: colors.grey.lighten4,
      },
      dark: {
        primary: '#0077B2',
        secondary: '#CDDC39',
        accent: '#843275',
        error: '#F44336',
        warning: '#FFC107',
        info: '#607D8B',
        success: '#4CAF50',
      },
    },
  },
});
