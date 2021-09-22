import api from '@/api';

export default {
  namespaced: true,
  strict: true,
  state: {
    initialRoute: undefined,
    isSignedIn: undefined,
  },
  getters: {
    initialRoute(state) {
      return state.initialRoute;
    },
    isSignedIn(state) {
      return state.isSignedIn;
    },
  },
  actions: {
    async init({ commit }) {
      await api.initClient((isSignedIn) => {
        commit('setSignedIn', isSignedIn);
      });
    },
    setInitialRoute({ commit }, route) {
      commit('setInitialRoute', route);
    },
    async signIn({ commit }) {
      await api.signIn();

      commit('setSignedIn', true);
    },
    async signOut({ commit }) {
      await api.signOut();

      commit('setSignedIn', false);
    },
  },
  mutations: {
    setInitialRoute(state, route) {
      state.initialRoute = route;
    },
    setSignedIn(state, isSignedIn) {
      state.isSignedIn = isSignedIn;
    },
  },
};
