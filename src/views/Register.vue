<template>
	<div class="register">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />
		<form v-on:submit.prevent="register()">
			<b-field label="Email">
				<b-input type="email" placeholder="e.g jonas@email.com" maxlength="30" v-model="email"></b-input>
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

			<div class="field">
				<b-checkbox v-model="checked">
					I agree to the
					<a href="#">terms and conditions</a>
				</b-checkbox>
			</div>

			<b-button native-type="submit" :type="btnType" :disabled="!checked">Register</b-button>
		</form>
	</div>
</template>

<script>
	import firebase from "firebase/app";
	import "firebase/auth";
	import Notification from "../components/Notification";

	export default {
		name: "Register",
		components: { Notification },
		data() {
			return {
				email: "",
				password: "",
				isActive: false,
				errorMessage: "",
				checked: false,
				notifType: "",
				btnType: "is-primary",
			};
		},
		methods: {
			register() {
				this.btnType = "is-primary is-loading";
				firebase
					.auth()
					.createUserWithEmailAndPassword(this.email, this.password)
					.then(
						() => {
							this.btnType = "is-primary";
							this.success();
						},
						(error) => {
							this.notifType = "is-light is-danger";
							this.isActive = true;
							this.errorMessage = error.message;
							this.btnType = "is-primary";
						}
					);
			},
			success() {
				this.$buefy.notification.open({
					message: "You have succsesfully registered and now logged in",
					type: "is-success",
					position: "is-top",
				});
			},
		},
	};
</script>

<style scoped>
	.register {
		max-width: 600px;
	}
</style>
