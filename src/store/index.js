import { createStore } from 'vuex';
import { extractContent, extractField } from '@/utils/email';

export default createStore({
  strict: true,
  state: {
    labels: {
      allIds: [],
      byId: {},
    },
    messages: {
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
    getMessageById: (state) => (id) => {
      return state.messages.byId[id];
    },
    getMessagesByLabel: (state) => () => {
      return state.messages.allIds.map((id) => {
        return state.messages.byId[id];
      });
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
    setMessage(state, message) {
      if (!state.messages.allIds.includes(message.id)) {
        state.messages.allIds.push(message.id);
      }
      state.messages.byId[message.id] = message;
    },
    setMessages(state, messages) {
      state.messages.allIds = [];
      state.messages.byId = {};

      messages.forEach((message) => {
        state.messages.allIds.push(message.id);
        state.messages.byId[message.id] = message;
      });
    },
  },
  actions: {
    setSignedIn({ commit }, isSignedIn) {
      commit('setSignedIn', isSignedIn);
    },
    async setLabels({ commit }, data) {
      const labels = data.result.labels.filter(({ name }) => {
        return name.includes('newsly_');
      });

      labels.forEach((label) => {
        commit('setLabel', label);
      });
    },
    async setMessages({ commit }, messages) {
      const nextMessages = messages.map(({ result }) => {
        return {
          ...result,
          date: extractField(result, 'Date'),
          from: extractField(result, 'From'),
          subject: extractField(result, 'Subject'),
        };
      });

      commit('setMessages', nextMessages);
    },
    async setMessage({ commit }, message) {
      const nextMessage = {
        ...message.result,
        content: extractContent(message.result),
        date: extractField(message.result, 'Date'),
        from: extractField(message.result, 'From'),
        subject: extractField(message.result, 'Subject'),
      };

      commit('setMessage', nextMessage);
    },
  },
  modules: {},
});
