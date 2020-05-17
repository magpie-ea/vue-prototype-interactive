import Vue from 'vue';
import App from './App.vue';
import store from './store';
import interactiveExperiment from './plugins/interactiveExperiment/index';

const deployConfig = {
  // experimentID: "20",
  experimentID: '50',
  serverAppURL: 'https://magpie-demo.herokuapp.com/api/submit_experiment/',
  // serverAppURL: "http://localhost:4000/api/submit_experiment/",
  socketURL: 'wss://magpie-demo.herokuapp.com/socket',
  // socketURL: "ws://localhost:4000/socket",
  deployMethod: 'debug',
  contact_email: 'YOUREMAIL@wherelifeisgreat.you',
  prolificURL: 'https://app.prolific.ac/submissions/complete?cc=EXAMPLE1234'
};

Vue.use(interactiveExperiment, deployConfig);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
