import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/Home.vue';
import LabelView from '@/views/Label.vue';
import MessageView from '@/views/Message.vue';
import SignInView from '@/views/SignIn.vue';

const routes = [
  {
    path: '/sign-in',
    name: 'SignIn',
    component: SignInView,
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/label/:labelId',
    name: 'Label',
    component: LabelView,
  },
  {
    path: '/label/:labelId/message/:messageId',
    name: 'Message',
    component: MessageView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
