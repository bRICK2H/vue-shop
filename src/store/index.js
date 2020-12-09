import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/_dry/auth'
import modal from './modules/_dry/modal'

import shop from './modules/shop/shop'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    // dry
    auth,
    modal,
    // project
    shop,
  }
})
