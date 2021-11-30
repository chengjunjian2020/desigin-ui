import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "intersection-observer";
import "desigin-ui/theme-chalk/src/index.less";
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
