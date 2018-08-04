import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.use(VueMoment)

import AddFeed from './components/AddFeed';
import Breast from './components/Breast';
import History from './components/History';
import LastFeed from './components/LastFeed';
import StartFeed from './components/StartFeed';

Vue.component('add-feed', AddFeed);
Vue.component('breast', Breast);
Vue.component('history', History);
Vue.component('last-feed', LastFeed);
Vue.component('start-feed', StartFeed);

new Vue({
  el: '#app',
  render: h => h(App)
})
