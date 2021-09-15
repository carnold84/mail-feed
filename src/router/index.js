import { createRouter, createWebHistory } from 'vue-router';
import Main from '@/views/Main.vue';
import SignInView from '@/views/SignIn.vue';

const routes = [
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignInView,
  },
  {
    path: '/',
    name: 'Main',
    component: Main,
  },
  {
    path: '/label/:id',
    name: 'Label',
    component: Main,
  },
  {
    path: '/message/:id',
    name: 'Message',
    component: Main,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
