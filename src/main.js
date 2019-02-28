import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import store from './store/'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min'
import 'font-awesome/css/font-awesome.css'
import "./assets/styles/reset.css"

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
