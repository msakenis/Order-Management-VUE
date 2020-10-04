<template>
  <div class="navigation">
    <b-navbar>
      <template slot="brand">
        <b-navbar-item tag="router-link" :to="{ path: '/orders' }">
          <img src="../assets/logo3.png" alt="cart logo" />
        </b-navbar-item>
      </template>

      <template v-if="loggedIn" slot="start">
        <!-- Show buttons only if logged in -->
        <b-navbar-item
          tag="router-link"
          v-for="link in links"
          :key="link.name"
          :to="{ path: link.url }"
          >{{ link.name }}</b-navbar-item
        >
      </template>

      <template slot="end">
        <b-navbar-item tag="div">
          <div class="buttons" v-if="loggedIn">
            <b-button v-on:click="signOut" type="is-light">Log Out</b-button>
          </div>

          <div class="buttons" v-else>
            <!-- Show buttons if not logged in -->
            <b-button tag="router-link" to="/register" type="is-primary"
              >Register</b-button
            >
            <b-button tag="router-link" to="/login" type="is-light"
              >Log in</b-button
            >
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Navigation",
  data() {
    return {
      loggedIn: false,
      links: [
        { name: "Add Order", url: "/add" },
        { name: "View Orders", url: "/orders" },
      ],
    };
  },
  methods: {
    signOut() {
      this.loggedIn = false;
      firebase.auth().signOut();
      this.$router.push("/login");
      this.$buefy.notification.open({
        message: "You are logged out now",
        position: "is-top",
      });
    },
  },
  beforeMount() {
    firebase
      .auth()
      .onAuthStateChanged((user) => user && (this.loggedIn = true));
  },
};
</script>
<style scoped>
.navbar-brand > .navbar-item {
  padding-left: 0;
}
</style>
