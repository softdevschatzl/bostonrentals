import { createStore } from "vuex";
import axios from 'axios';

export default createStore({
  state: {
    isLoggedIn: false,
  },
  mutations: {
    SET_LOGIN_STATUS(state, status) {
      state.isLoggedIn = status;
      console.log('Vuex login status:', status);
    },
    setSavedLists(state, lists) {
      state.savedLists = lists;
    },
    updateLists(state, updatedList) {
      const index = state.savedLists.findIndex(list => list.id === updatedList.id);
      if (index !== -1) {
        state.savedLists.splice(index, 1, updatedList);
      }
    }
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
    fetchSavedLists({ commit }) {
      // Fetch saved lists from the server
      axios.get('/api/lists').then(response => {
        commit('setSavedLists', response.data);
      })
    },
  },
  getters: {
    isLoggedIn: state => state.isLoggedIn,
    savedLists: state => state.savedLists,
  },
});