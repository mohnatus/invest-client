import Vue from 'vue/dist/vue.js';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import App from './components/App/index.vue';
import Portfolio from './components/Portfolio/index.vue';
import Composition from './components/Composition/index.vue';
import './style.scss';

const router = new VueRouter({
  routes: [
    { path: '/portfolio', component: Portfolio },
    { path: '/composition', component: Composition }
  ]
});

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app');
