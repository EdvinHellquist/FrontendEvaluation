import { createRouter, createWebHistory } from 'vue-router'
import Start from '../views/Start.vue'
import Profile from '@/views/Profile.vue'
import Product from '@/views/Product.vue'
import Contact from '@/views/Contact.vue'

const routes = [
  { path: '/', component: Start },
  { path: '/profile', component: Profile },
  { path: '/details/:id', component: Product },
  { path: '/contact', component: Contact}
]

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})

export default router
