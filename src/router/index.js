import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import firebase from "firebase/app";
import "firebase/auth";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      requiresAnon: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: {
      requiresAnon: true,
    },
  },
  {
    path: "/add",
    name: "Add Order",
    component: () =>
      import(/* webpackChunkName: "Add Order" */ "../views/AddOrder.vue"),
  },
  {
    path: "/edit-order/:id",
    name: "Edit Order",
    component: () =>
      import(/* webpackChunkName: "Edit Order" */ "../views/EditOrder.vue"),
  },
  {
    path: "/info-order/:id",
    name: "Information About the Order",
    component: () =>
      import(
        /* webpackChunkName: "Information About the Order" */ "../views/OrderInformation.vue"
      ),
  },
  {
    path: "/orders",
    name: "View Orders",
    component: () =>
      import(/* webpackChunkName: "View Orders" */ "../views/ViewOrders.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (!user && to.matched.some((route) => route.meta.requiresAuth)) {
      next({ path: "/login" });
    } else if (user && to.matched.some((route) => route.meta.requiresAnon)) {
      next({ path: "/home" });
    } else {
      next();
    }
  });
});

export default router;
