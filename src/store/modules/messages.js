import api from '@/api';

export default {
  namespaced: true,
  strict: true,
  state: {
    messages: {
      areLoaded: false,
      byLabel: {},
      byId: {},
    },
    pageSize: 20,
  },
  getters: {
    getAreMessagesLoaded: (state) => (labelId) => {
      const labelMessages = state.messages.byLabel[labelId];

      return labelMessages?.areLoaded;
    },
    getMessagesByLabel: (state) => (labelId) => {
      const messageIds = state.messages.byLabel[labelId]?.allIds;

      if (!messageIds) {
        return undefined;
      }

      let messages = messageIds.map((id) => {
        return state.messages.byId[id];
      });

      return messages;
    },
    getNextPageTokenByLabel: (state) => (labelId) => {
      return state.messages.byLabel[labelId]?.nextPageToken;
    },
    getPageSize(state) {
      return state.pageSize;
    },
  },
  actions: {
    async fetchMessage({ commit }, { labelId, messageId }) {
      const message = await api.loadLabelMessage(messageId);

      commit('setLabelMessage', { labelId, message });
    },
    async fetchNextMessages({ commit, state }, { labelId }) {
      console.log(state, state.pageSize);
      const response = await api.loadLabelMessages({
        labelId,
        maxResults: state.pageSize,
        pageToken: state.messages.byLabel[labelId]?.nextPageToken,
      });

      commit('setMessagesByLabel', {
        labelId,
        messages: response.items,
        nextPageToken: response.nextPageToken,
      });
    },
    async markMessageRead({ commit }, { labelId, messageId, isRead }) {
      const message = await api.markMessageRead(messageId, isRead);

      commit('setLabelMessage', { labelId, message });
    },
  },
  mutations: {
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
    setNextPageTokenByLabel(state, { labelId, nextPageToken }) {
      const labelMessages = state.messages.byLabel[labelId];
      labelMessages.nextPageToken = nextPageToken;
    },
    setMessagesByLabel(state, { labelId, messages, nextPageToken }) {
      let labelMessages = state.messages.byLabel[labelId];

      if (!labelMessages) {
        labelMessages = {
          allIds: [],
          nextPageToken: null,
        };
      }

      messages.forEach((message) => {
        state.messages.byId[message.id] = message;
        labelMessages.allIds.push(message.id);
      });
      labelMessages.nextPageToken = nextPageToken;
      labelMessages.areLoaded = true;

      state.messages.byLabel[labelId] = labelMessages;
    },
  },
  modules: {},
};
