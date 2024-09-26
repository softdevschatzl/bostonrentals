import { createStore } from "vuex";

export default createStore({
  state: {
    isLoggedIn: false,
  },
  mutations: {
    SET_LOGIN_STATUS(state, status) {
      state.isLoggedIn = status;
      // console.log('Vuex login status:', status);
    },
  },
  actions: {
    setLoginStatus({ commit }, status) {
      commit("SET_LOGIN_STATUS", status);
    },
    checkIfLoggedIn({ commit }) {
      return new Promise((resolve, reject) => {
        fetch('/api/check-login-status')
          .then(response => response.json())
          .then(data => {
            commit('SET_LOGIN_STATUS', data.isLoggedIn);
            resolve();
          })
          .catch(error => {
            console.error('Error during checkIfLoggedIn:', error);
            reject(error);
          })
      })
    },
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
  },
});