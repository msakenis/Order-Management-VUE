<template>
  <div class="login">
    <Notification
      v-if="isActive"
      type="is-light is-danger"
      :message="errorMessage"
    />

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
        >
        </b-input>
      </b-field>

      <b-button native-type="submit" :type="buttonType">Login</b-button>
    </form>
  </div>
</template>

<script>
import firebase from "firebase/app";
import "firebase/auth";
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
      buttonType: "is-primary",
    };
  },
  methods: {
    login() {
      this.buttonType = "is-primary is-loading";
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          () => {
            this.buttonType = "is-primary";
            this.$router.push("/home");
          },
          (error) => {
            this.buttonType = "is-primary";
            this.isActive = true;
            this.errorMessage = error.message;
          }
        );
    },
  },
};
</script>

<style scoped>
form {
  max-width: 600px;
}
</style>
