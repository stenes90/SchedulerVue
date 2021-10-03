import { createApp } from "vue";
import App from "./App.vue";
import store from "./Store/index.js";

const app = createApp(App);
app.use(store);

app.config.performance = true;
app.config.devtools = true;

app.mount("#app");
