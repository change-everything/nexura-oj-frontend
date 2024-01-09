import { createApp } from "vue";
import App from "./App.vue";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import router from "./router";
import store from "./store";
import "./access";
import "bytemd/dist/index.css";
import "bytemd/locales/zh_Hans.json";
import "highlight.js/styles/atom-one-dark.css";
import "highlight.js/lib/common";
import hljsVuePlugin from "@highlightjs/vue-plugin";

createApp(App)
  .use(ArcoVue)
  .use(store)
  .use(router)
  .use(ArcoVueIcon)
  .use(hljsVuePlugin)
  .mount("#app");
