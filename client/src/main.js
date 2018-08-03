import Vue from 'vue'
import App from './App.vue'
import Vuetify from 'vuetify'
import VueMoment from 'vue-moment'
import 'vuetify/dist/vuetify.css'

Vue.use(Vuetify)
Vue.use(VueMoment)

new Vue({
  el: '#app',
  render: h => h(App)
})
