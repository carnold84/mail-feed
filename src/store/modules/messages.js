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
    showRead: true,
  },
  getters: {
    getMessageById: (state) => (id) => {
      return state.messages.byId[id];
    },
    getAreMessagesLoaded: (state) => (labelId) => {
      const labelMessages = state.messages.byLabel[labelId];

      return labelMessages?.areLoaded;
    },
    getMessagesByLabel: (state) => ({ labelId }) => {
      const messageIds = state.messages.byLabel[labelId]?.allIds;

      if (!messageIds) {
        return undefined;
      }

      const messages = [];

      messageIds.forEach((id) => {
        const message = state.messages.byId[id];

        if (state.showRead === true) {
          messages.push(message);
        } else if (message.isRead === false) {
          messages.push(message);
        }
      });

      return messages;
    },
    getNextPageTokenByLabel: (state) => (labelId) => {
      return state.messages.byLabel[labelId]?.nextPageToken;
    },
    getPageSize(state) {
      return state.pageSize;
    },
    getShowRead(state) {
      return state.showRead;
    },
  },
  actions: {
    async fetchMessage({ commit }, { labelId, messageId }) {
      const message = await api.loadLabelMessage(messageId);

      commit('setMessageByLabel', { labelId, message });
    },
    async fetchNextMessages({ commit, state }, { labelId, reset = false }) {
      if (reset) {
        commit('setNextPageTokenByLabel', { labelId, nextPageToken: null });
      }

      const response = await api.loadLabelMessages({
        labelId,
        maxResults: state.pageSize,
        pageToken: state.messages.byLabel[labelId]?.nextPageToken,
        showRead: state.showRead,
      });

      commit('setMessagesByLabel', {
        labelId,
        messages: response.items,
        nextPageToken: response.nextPageToken,
        reset,
      });
    },
    async markMessageRead({ commit }, { messageId, isRead }) {
      const message = await api.markMessageRead(messageId, isRead);

      commit('updateMessage', message);
    },
    setShowRead({ commit }, showRead) {
      commit('setShowRead', showRead);
    },
  },
  mutations: {
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
    setMessageByLabel(state, { labelId, message }) {
      let labelMessages = state.messages.byLabel[labelId];

      if (!labelMessages) {
        labelMessages = {
          allIds: [],
          nextPageToken: null,
        };
      }

      state.messages.byId[message.id] = message;
      labelMessages.allIds.push(message.id);

      state.messages.byLabel[labelId] = labelMessages;
    },
    setMessagesByLabel(state, { labelId, messages, nextPageToken, reset }) {
      let labelMessages = state.messages.byLabel[labelId];

      if (!labelMessages || reset) {
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
    setShowRead(state, showRead) {
      state.showRead = showRead;
    },
    updateMessage(state, message) {
      state.messages.byId[message.id] = message;
    },
  },
  modules: {},
};
