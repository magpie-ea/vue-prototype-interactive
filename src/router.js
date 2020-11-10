import Router from 'vue-router';
import Vue from 'vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: () => import('@/components/InteractiveWelcome.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('@/components/Lobby.vue')
    },
    {
      path: '/color-reference',
      name: 'color-reference',
      component: () => import('@/components/ColorReference.vue')
    }
  ]
});

export default router;
