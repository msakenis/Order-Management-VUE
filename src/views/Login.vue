<template>
  <div class="login">
    <Notification
      v-if="isActive"
      type="is-light is-danger"
      :message="errorMessage"
    />
    <div class="columns">
      <div class="column">
        <form v-on:submit.prevent="login">
          <b-field label="Email">
            <b-input
              type="email"
              placeholder="e.g jonas@email.com"
              maxlength="30"
              v-model="email"
            ></b-input>
          </b-field>

          <b-field label="Password">
            <b-input
              type="password"
              v-model="password"
              placeholder="Password"
              maxlength="30"
              password-reveal
            ></b-input>
          </b-field>

          <b-button native-type="submit" :type="btnType">Login</b-button>
        </form>
      </div>
      <div class="column">
        <section id="firebaseui-auth-container"></section>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
const firebaseui = require("firebaseui");
import "firebaseui/dist/firebaseui.css";
import Notification from "../components/Notification";

export default {
  name: "Login",
  components: { Notification },
  data() {
    return {
      email: "",
      password: "",
      isActive: false,
      errorMessage: "",
      btnType: "is-primary",
    };
  },
  methods: {
    login() {
      this.btnType = "is-primary is-loading";
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.btnType = "is-primary";
            this.$buefy.notification.open({
              message: "You are logged in now",
              position: "is-top",
              type: "is-light is-success",
            });
          },
          (error) => {
            this.btnType = "is-primary";
            this.isActive = true;
            this.errorMessage = error.message;
          }
        );
    },
  },
  mounted() {
    let ui = firebaseui.auth.AuthUI.getInstance();
    if (!ui) {
      ui = new firebaseui.auth.AuthUI(firebase.auth());
    }
    var uiConfig = {
      signInSuccessUrl: "/orders",
      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      ],
    };
    ui.start("#firebaseui-auth-container", uiConfig);
  },
};
</script>
