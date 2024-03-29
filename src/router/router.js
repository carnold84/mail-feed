import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home.vue';
import LabelView from '@/views/Label.vue';
import MessageView from '@/views/Message.vue';
import SignInView from '@/views/SignIn.vue';
import SplashView from '@/views/Splash.vue';
import store from '@/store';

const routes = [
  {
    component: SignInView,
    name: 'SignIn',
    path: '/sign-in',
    meta: {
      shouldAuth: false,
    },
  },
  {
    component: SplashView,
    name: 'Splash',
    path: '/',
    meta: {
      shouldAuth: false,
    },
  },
  {
    component: HomeView,
    name: 'Home',
    path: '/home',
    meta: {
      shouldAuth: true,
    },
  },
  {
    component: LabelView,
    name: 'Label',
    path: '/label/:labelId',
    meta: {
      shouldAuth: true,
    },
  },
  {
    component: MessageView,
    name: 'Message',
    path: '/label/:labelId/message/:messageId',
    meta: {
      shouldAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  const isSignedIn = store.getters['auth/isSignedIn'];
  const initialRoute = store.getters['auth/initialRoute'];

  if (isSignedIn === undefined && initialRoute === undefined) {
    if (to.meta.shouldAuth === false) {
      // redirect to home once logged in
      store.dispatch('auth/setInitialRoute', '/home');
    } else {
      // redirect to wherever it was going once logged in
      store.dispatch('auth/setInitialRoute', to.path);
    }
    next({ name: 'Splash' });
  } else if (isSignedIn === undefined && to.name === 'Splash') {
    next();
  } else if (isSignedIn === false) {
    if (to.name === 'SignIn') {
      next();
    } else {
      next({ name: 'SignIn' });
    }
  } else if (to.meta.shouldAuth === false) {
    next({ name: 'Home' });
  } else {
    next();
  }
});

export default router;
