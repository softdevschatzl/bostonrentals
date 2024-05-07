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
  },
});