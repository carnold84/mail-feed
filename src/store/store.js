import { createStore } from 'vuex';
import api from '@/api';

export default createStore({
  strict: true,
  state: {
    labels: {
      allIds: [],
      byId: {},
      isLoaded: false,
    },
    initialRoute: undefined,
    isSignedIn: undefined,
  },
  getters: {
    areLabelsLoaded(state) {
      return state.labels.isLoaded;
    },
    initialRoute(state) {
      return state.initialRoute;
    },
    isSignedIn(state) {
      return state.isSignedIn;
    },
    getLabelById: (state) => (id) => {
      return state.labels.byId[id];
    },
    getAllLabels(state) {
      return state.labels.allIds.map((id) => {
        return state.labels.byId[id];
      });
    },
    getLabelNextPageToken: (state) => (labelId) => {
      const label = state.labels.byId[labelId];
      return label?.nextPageToken;
    },
    getLabelPrevPageToken: (state) => (labelId) => {
      const label = state.labels.byId[labelId];
      return label?.prevPageToken;
    },
    getMessageById: (state) => ({ labelId, messageId }) => {
      const label = state.labels.byId[labelId];
      return label?.messages?.byId[messageId];
    },
    getMessagesByLabel: (state) => (id, { sortBy }) => {
      const label = state.labels.byId[id];

      if (!label?.messages) {
        return undefined;
      }

      let labels = label?.messages.allIds.map((id) => {
        return label.messages.byId[id];
      });
      labels.sort((a, b) => {
        if (sortBy.direction === 'desc') {
          return new Date(b[sortBy.field]) - new Date(a[sortBy.field]);
        } else {
          return new Date(a[sortBy.field]) - new Date(b[sortBy.field]);
        }
      });

      return labels;
    },
  },
  actions: {
    async init({ commit }) {
      await api.initClient((isSignedIn) => {
        commit('setSignedIn', isSignedIn);
      });
    },
    async loadLabels({ commit }) {
      const labels = await api.loadLabels();

      labels.forEach((label) => {
        label.messages = {
          allIds: [],
          byId: {},
        };
      });

      console.log(labels);

      commit('setLabels', labels);
    },
    async loadLabel({ commit }, labelId) {
      const label = await api.loadLabel(labelId);
      label.messages = {
        allIds: [],
        byId: {},
      };

      commit('setLabel', label);
    },
    async loadLabelMessages({ commit }, { labelId, maxResults, pageToken }) {
      const response = await api.loadLabelMessages({
        labelId,
        maxResults,
        pageToken,
      });

      commit('setLabelNextPageToken', {
        labelId,
        nextPageToken: response.nextPageToken,
      });
      commit('setLabelPrevPageToken', {
        labelId,
        prevPageToken: response.prevPageToken,
      });
      commit('setLabelMessages', { labelId, messages: response.items });
    },
    async loadLabelMessage({ commit }, { labelId, messageId }) {
      const message = await api.loadLabelMessage(messageId);

      commit('setLabelMessage', { labelId, message });
    },
    async markMessageRead({ commit }, { labelId, messageId, isRead }) {
      const message = await api.markMessageRead(messageId, isRead);

      commit('setLabelMessage', { labelId, message });
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
    setLabelMessage(state, { labelId, message }) {
      const label = state.labels.byId[labelId];

      label.messages.byId[message.id] = message;
    },
    setLabelMessages(state, { labelId, messages }) {
      const label = state.labels.byId[labelId];

      label.isLoaded = false;
      label.messages.byId = {};
      label.messages.allIds = [];

      messages.forEach((message) => {
        if (label.messages.allIds.indexOf(message.id) === -1) {
          label.messages.allIds.push(message.id);
        }
        label.messages.byId[message.id] = message;
      });
      label.isLoaded = true;
    },
    setLabelNextPageToken(state, { labelId, nextPageToken }) {
      const label = state.labels.byId[labelId];

      label.nextPageToken = nextPageToken;
    },
    setLabelPrevPageToken(state, { labelId, prevPageToken }) {
      const label = state.labels.byId[labelId];

      label.prevPageToken = prevPageToken;
    },
    setSignedIn(state, isSignedIn) {
      state.isSignedIn = isSignedIn;
    },
  },
  modules: {},
});
