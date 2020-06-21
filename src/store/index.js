import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    passwordDialogFlg: false
  },
  mutations: {
    setUser: function(state, payload) {
      state.user = payload
    },
    switchPasswordDialogFlg: function(state, payload) {
      state.passwordDialogFlg = payload
    },
    clearState: function(state) {
      state.user = {}
      state.passwordDialogFlg = false
    }
  },
  actions: {
  },
  getters: {
    isAuth: function(state) {
      return Object.keys(state.user).length
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: 'book-shelf',
    storage: sessionStorage
  })]
})
