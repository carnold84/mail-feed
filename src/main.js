import { createApp } from 'vue';
import VueGapi from 'vue-gapi';
import App from './App.vue';
import router from './router';
import store from './store';

const app = createApp(App)
  .use(VueGapi, {
    apiKey: process.env.VUE_APP_API_KEY,
    clientId: process.env.VUE_APP_CLIENT_ID,
    discoveryDocs: [
      'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',
    ],
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
  })
  .use(store)
  .use(router);
app.mount('#app');
