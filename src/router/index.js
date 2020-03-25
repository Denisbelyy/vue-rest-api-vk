import Vue from "vue";
import VueRouter from "vue-router";
import Users from "../views/Users.vue";
import UserPage from "../views/UserPage.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Users",
    component: Users
  },
  {
    path: "/:id",
    name: "User",
    component: UserPage
  }
];

const router = new VueRouter({
  routes
});

export default router;
