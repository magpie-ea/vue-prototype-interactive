import Vue from 'vue';
import Vuex from 'vuex';

import * as config from './modules/config';
import * as interactiveExperiment from './modules/interactiveExperiment';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    config,
    interactiveExperiment
  }
});
