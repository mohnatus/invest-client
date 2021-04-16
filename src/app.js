import Vue from 'vue/dist/vue.js';
import App from './components/App/index.vue';
import './style.scss';

new Vue({
  render: (h) => h(App, { props: { url: 'http://localhost:3000' } })
}).$mount('#app');
