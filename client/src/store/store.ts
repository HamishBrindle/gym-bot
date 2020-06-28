import Vuex, { StoreOptions } from 'vuex';
import { ORMDatabase } from 'vuex-orm-decorators';
import vuexPersist from '@/plugins/vuex-persist';
import { VuexOrmPlugin } from '@/plugins/vuex-orm';
import { context } from './modules';
import { ICustomStore, IRootState } from '@/lib/interfaces';
import pathify from '@/plugins/vuex-pathify';

const isProduction = (process.env.NODE_ENV === 'production');

/**
 * Creates and initializes a Vuex Store.
 */
async function init() {
  const storeOptions: StoreOptions<IRootState> = {
    plugins: [
      pathify.plugin,
      ORMDatabase.install({
        plugins: [VuexOrmPlugin],
      }),
      vuexPersist.plugin,
    ],
    strict: (!isProduction),
    state: {
      version: '1.0.0',
    },
    mutations: {
      RESTORE_MUTATION: vuexPersist.RESTORE_MUTATION,
    },
    actions: {},
    modules: {
      context,
    },
  };

  const vuexStore = new Vuex.Store(storeOptions) as ICustomStore;

  await vuexStore.restored;

  return vuexStore;
}

export default {
  init,
  ...Vuex,
};
