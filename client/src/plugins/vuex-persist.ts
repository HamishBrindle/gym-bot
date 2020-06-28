import VuexPersistence from 'vuex-persist';
import localforage from 'localforage';

const isProduction = (process.env.NODE_ENV === 'production');

const vuexPersistOptions = {
  strictMode: (!isProduction),
  storage: localforage,
  asyncStorage: true,
  modules: [
    'entities',
    'context',
  ],
};

export default new VuexPersistence(vuexPersistOptions);
