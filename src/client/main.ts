import "./style.css";
import { VueElement, createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import vue3GoogleLogin from "vue3-google-login";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { store } from "./store/store";
import Vuetify from "@/plugins/vuetify";
import PrimeVue from "primevue/config";
import 'tailwindcss/tailwind.css';


library.add(fas, far, fab);

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(router)
  .use(vue3GoogleLogin, {
    clientId:
      "17096130375-cb5v6mqhg3llh1r7ul1f67rn3j7gpmaj.apps.googleusercontent.com",
  })
  .use(Vuetify)
  .use(store)
  .use(PrimeVue)
  .mount("#app");