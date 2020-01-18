import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Download from "./views/Download.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "Helix | Small files need love too"
      }
    },
    {
      path: "/about",
      name: "about",
      component: About
    },
    {
      path: "/download/:id",
      name: "download",
      component: Download,
      props: route => ({ id: route.params.id }),
      meta: {
        title: "Helix | Download Files"
      }
    }
  ]
});
