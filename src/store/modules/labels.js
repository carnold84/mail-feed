import api from '@/api';

export default {
  namespaced: true,
  strict: true,
  state: {
    labels: {
      allIds: [],
      byId: {},
      isLoaded: false,
    },
  },
  getters: {
    areLabelsLoaded(state) {
      return state.labels.isLoaded;
    },
    getLabelById: (state) => (id) => {
      return state.labels.byId[id];
    },
    getAllLabels(state) {
      return state.labels.allIds.map((id) => {
        return state.labels.byId[id];
      });
    },
  },
  actions: {
    async fetchLabels({ commit }) {
      const labels = await api.loadLabels();

      commit('setLabels', labels);
    },
    async fetchLabel({ commit }, labelId) {
      const label = await api.loadLabel(labelId);

      commit('setLabel', label);
    },
  },
  mutations: {
    setLabel(state, label) {
      if (state.labels.allIds.indexOf(label.id) === -1) {
        state.labels.allIds.push(label.id);
      }
      state.labels.byId[label.id] = label;
    },
    setLabels(state, labels) {
      state.labels.isLoaded = true;
      labels.forEach((label) => {
        if (state.labels.allIds.indexOf(label.id) === -1) {
          state.labels.allIds.push(label.id);
        }
        state.labels.byId[label.id] = label;
      });
    },
  },
};
