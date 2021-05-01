import Vue from 'vue/dist/vue.js';

import VueRouter from 'vue-router';

Vue.use(VueRouter);

import App from './components/App/index.vue';
import Etfs from './components/Etfs/index.vue';
import Portfolio from './components/Portfolio/index.vue';
import Balance from './components/Balance/index.vue';
import './style.scss';

const router = new VueRouter({
  routes: [
    { path: '/etfs', component: Etfs },
    { path: '/portfolio', component: Portfolio },
    { path: '/balance', component: Balance }
  ]
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
