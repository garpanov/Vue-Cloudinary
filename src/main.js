import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createWebHistory, createRouter } from 'vue-router'
import Home from './components/Home.vue'
import Favorite from './components/Favorite.vue'
import sneaker_info from './components/for_onfo_sneaker/sneaker_info.vue'
import for_admin from './components/admin/for_admin.vue'
import Forms from './components/for_druwer/Form.vue'
import test from './components/for_druwer/test.vue'

const app = createApp(App)

const routes = [
    { path: '/', component: Home },
    { path: '/favorite', component: Favorite },
    { path: '/info_sneaker/:code', component: sneaker_info},
    { path: '/for_admin_panel', component: for_admin},
    { path: '/forms', component: Forms},
    { path: '/test', component: test }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


app.use(router)


app.mount('#app')




