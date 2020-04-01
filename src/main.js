import Vue from 'vue'
import Vuex from 'vuex'
import VueSocketIO from 'vue-socket.io'
import VueRouter from 'vue-router'
import App from './App.vue'
import store from './store'
import routes from './routes'

Vue.config.productionTip = false

Vue.use(Vuex)

const vuexStore = new Vuex.Store(store)

Vue.use(new VueSocketIO({
  debug: process.env.NODE_ENV === 'development',
  connection: process.env.VUE_APP_SERVER_ADDR,
  vuex: {
    vuexStore,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_',
  },
}))

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  mode: 'history'
})

new Vue({
  render: h => h(App),
  router,
  store: vuexStore,
}).$mount('#app')
