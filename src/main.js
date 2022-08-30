import Vue from "vue";
import App from "./App.vue";
//import router from "./router";
//import store from "./store";

//Arcgis javascript api
import { loadScript } from 'esri-loader';

//Vue.config.productionTip = false;

// preload the ArcGIS API
const options = {
  //url: 'https://js.arcgis.com/4.22/',
  url: 'https://js.arcgis.com/4.22/',
};
loadScript(options)

new Vue({
  //router,
  //store,
  render: h => h(App)
}).$mount("#app");
