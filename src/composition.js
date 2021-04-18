import Vue from 'vue/dist/vue.js';
import Composition from './components/Composition/index.vue';
import './style.scss';

new Vue({
  render: (h) => h(Composition)
}).$mount('#app');
