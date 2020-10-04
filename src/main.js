import Vue from 'vue';
import App from './App.vue';
// import interactiveExperiment from './plugins/interactiveExperiment/index';
// import store from './store/store'
// import store from './store-interactive-experiment';
import store from './store/index';

// Vue.use(interactiveExperiment, deployConfig);

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount('#app');
