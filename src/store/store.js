import { createStore } from 'vuex';
import {
  initClient,
  loadLabel,
  loadLabels,
  loadLabelMessage,
  loadLabelMessages,
} from '@/api';

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
    getMessageById: (state) => ({ labelId, messageId }) => {
      const label = state.labels.byId[labelId];
      return label?.messages?.byId[messageId];
    },
    getMessagesByLabel: (state) => (id) => {
      const label = state.labels.byId[id];

      if (!label?.messages) {
        return undefined;
      }

      return label?.messages.allIds.map((id) => {
        return label.messages.byId[id];
      });
    },
  },
  actions: {
    async init({ commit }) {
      await initClient((isSignedIn) => {
        commit('setSignedIn', isSignedIn);
      });
    },
    async loadLabels({ commit }) {
      const labels = await loadLabels();

      commit('setLabels', labels);
    },
    async loadLabel({ commit }, labelId) {
      const label = await loadLabel(labelId);

      commit('setLabel', label);
    },
    async loadLabelMessages({ commit }, labelId) {
      const messages = await loadLabelMessages(labelId);

      commit('setLabelMessages', { labelId, messages });
    },
    async loadLabelMessage({ commit }, { labelId, messageId }) {
      const message = await loadLabelMessage(messageId);

      commit('setLabelMessage', { labelId, message });
    },
    setInitialRoute({ commit }, route) {
      commit('setInitialRoute', route);
    },
  },
  mutations: {
    setInitialRoute(state, route) {
      state.initialRoute = route;
    },
    setLabel(state, label) {
      state.labels.allIds.push(label.id);
      state.labels.byId[label.id] = label;
    },
    setLabels(state, labels) {
      state.labels.isLoaded = true;
      labels.forEach((label) => {
        state.labels.allIds.push(label.id);
        state.labels.byId[label.id] = label;
      });
    },
    setLabelMessage(state, { labelId, message }) {
      const label = state.labels.byId[labelId];

      if (!label?.messages) {
        label.messages = {
          allIds: [],
          byId: {},
        };
      }

      label.messages.byId[message.id] = message;
    },
    setLabelMessages(state, { labelId, messages }) {
      const nextMessages = {
        allIds: [],
        byId: {},
      };
      messages.forEach((message) => {
        nextMessages.allIds.push(message.id);
        nextMessages.byId[message.id] = message;
      });
      const label = state.labels.byId[labelId];
      label.isLoaded = true;
      label.messages = nextMessages;
    },
    setSignedIn(state, isSignedIn) {
      state.isSignedIn = isSignedIn;
    },
  },
  modules: {},
});
