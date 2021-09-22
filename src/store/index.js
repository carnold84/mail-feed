import { createStore } from 'vuex';
import auth from './modules/auth';
import labels from './modules/labels';
import messages from './modules/messages';

export default createStore({
  strict: true,
  modules: {
    auth,
    labels,
    messages,
  },
});
