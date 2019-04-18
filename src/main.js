import Vue from 'vue'
import App from './App.vue'
import router from './router'

import ECharts from "vue-echarts"
// 手动引入 ECharts 各模块来减小打包体积
import 'echarts/lib/chart/bar'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/title'
import "echarts/lib/component/markLine"
import "echarts/lib/component/markPoint"
import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import './plugins/element.js'
import store from './store/'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-table/dist/bootstrap-table.min.css'
import 'bootstrap-table/dist/bootstrap-table.min.js'
import 'bootstrap-table/dist/locale/bootstrap-table-zh-CN.min.js'
import 'font-awesome/css/font-awesome.css'
import "./assets/styles/reset.css"
import _ from "lodash"

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component("v-chart", ECharts);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
