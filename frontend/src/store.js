import { createStore } from "vuex";

export default createStore({
  state: {
    isLoggedIn: false,
  },
  mutations: {
    SET_LOGIN_STATUS(state, status) {
      state.isLoggedIn = status;
    },
  },
  actions: {
    setLoginStatus({ commit }, status) {
      commit("SET_LOGIN_STATUS", status);
    },
    async checkIfLoggedIn({ commit }) {
      try {
        const response = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
        });
        if (response.ok) {
          commit('SET_LOGIN_STATUS', true);
        } else {
          commit('SET_LOGIN_STATUS', false);
        }
      } catch (error) {
        console.error('Error checking if logged in:', error);
      }
    }
  },
});