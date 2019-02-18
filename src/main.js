import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import "./assets/styles/reset.css"
import './plugins/element.js'

Vue.config.productionTip = false
Vue.use(ElementUI)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
