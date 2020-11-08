import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/welcome',
      name: 'welcome',
      component: () => import('@/components/InteractiveWelcome.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('@/components/Lobby.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/components/AudioDiscriminationWithPriming.vue')
    }
  ]
});

export default router;
