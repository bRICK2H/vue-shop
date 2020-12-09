import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Vuelidate from 'vuelidate'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

import firebaseConfig from './firebase/config'

import '@/assets/scss/_general.scss'

Vue.use(Vuelidate)
Vue.config.productionTip = false

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
