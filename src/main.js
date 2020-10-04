import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "normalize.css";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "./services/firebase-config";
import VueHtmlToPaper from "vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: ["https://unpkg.com/buefy/dist/buefy.min.css"],
};

Vue.use(VueHtmlToPaper, options);
Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
