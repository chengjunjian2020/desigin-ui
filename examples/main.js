import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import '@/common/style/index.less'
// import 'element-ui/lib/theme-chalk/index.css';
// import { Checkbox } from 'element-ui';
// Vue.use(Checkbox)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
