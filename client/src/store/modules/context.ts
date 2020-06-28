import { make } from 'vuex-pathify';

interface IContextState {
  /**
   * UI theme options and values
   */
  theme: {
    /**
     * Theme is currently set to dark
     */
    dark: boolean;
  };

  /**
   * Overlay and page-loading indicator
   */
  overlay: {
    /**
     * Overlay is visible
     */
    visible: boolean;
  };
}

const state: IContextState = {
  theme: {
    dark: false,
  },
  overlay: {
    visible: false,
  },
};

const mutations = make.mutations(state);
const getters = make.getters(state);
const actions = make.actions(state);

export default {
  namespaced: true,
  state,
  mutations,
  getters,
  actions,
};
