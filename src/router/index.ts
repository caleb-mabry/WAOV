import { createWebHistory, createRouter } from "vue-router";
import ServerSelect from "../views/serverSelect.vue";
import ServerConnect from "../views/ServerConnect.vue"
import NotFound from "../views/NotFound.vue"
const routes = [
  {
    path: "/",
    name: "Home",
    component: ServerSelect,
  },
  {
    path: "/server",
    name: "Server",
    component: ServerConnect
  },
  {
      path: "/:catchAll(.*)",
      name:"NotFound",
      component: NotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;