import { createStore } from 'vuex';
import { extractContent, extractField } from '@/utils/email';

export default createStore({
  strict: true,
  state: {
    labels: {
      allIds: [],
      byId: {},
    },
    isSignedIn: undefined,
  },
  getters: {
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
    setSignedIn({ commit }, isSignedIn) {
      commit('setSignedIn', isSignedIn);
    },
    async setLabel({ commit }, label) {
      commit('setLabel', label.result);
    },
    async setLabels({ commit }, data) {
      const labels = data.result.labels.filter(({ name }) => {
        return name.includes('newsly_');
      });

      commit('setLabels', labels);
    },
    async setLabelMessages({ commit }, { labelId, messages }) {
      const nextMessages = messages.map(({ result }) => {
        return {
          ...result,
          content: extractContent(result),
          date: extractField(result, 'Date'),
          from: extractField(result, 'From').replace(/<.*?>\s?/g, ''),
          subject: extractField(result, 'Subject'),
        };
      });

      commit('setLabelMessages', { labelId, messages: nextMessages });
    },
    async setLabelMessage({ commit }, { labelId, message }) {
      const nextMessage = {
        ...message.result,
        content: extractContent(message.result),
        date: extractField(message.result, 'Date'),
        from: extractField(message.result, 'From').replace(/<.*?>\s?/g, ''),
        subject: extractField(message.result, 'Subject'),
      };

      commit('setLabelMessage', { labelId, message: nextMessage });
    },
  },
  mutations: {
    setSignedIn(state, isSignedIn) {
      state.isSignedIn = isSignedIn;
    },
    setLabel(state, label) {
      state.labels.allIds.push(label.id);
      state.labels.byId[label.id] = label;
    },
    setLabels(state, labels) {
      state.labels.allIds = [];
      state.labels.byId = {};

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
      label.messages = nextMessages;
    },
  },
  modules: {},
});
