import Vue from 'vue';
import App from './App.vue';
// import interactiveExperiment from './plugins/interactiveExperiment/index';
// import store from './store/store'
// import store from './store-interactive-experiment';
import store from './store/index';
import router from './router';

// Vue.use(interactiveExperiment, deployConfig);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
