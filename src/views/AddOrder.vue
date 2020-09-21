<template>
	<div class="addOrder">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />
		<form v-on:submit.prevent="add">
			<b-field grouped group-multiline>
				<b-field label="Order Date">
					<b-datepicker
						v-model="date"
						:first-day-of-week="1"
						placeholder="Click to select..."
						locale="lt-LT"
					>
						<button class="button is-primary" @click.prevent="date = new Date()">
							<b-icon icon="calendar-today"></b-icon>
							<span>Today</span>
						</button>

						<button class="button is-danger" @click.prevent="date = null">
							<b-icon icon="close"></b-icon>
							<span>Clear</span>
						</button>
					</b-datepicker>
				</b-field>

				<b-field label="Order No.">
					<b-input v-model="orderNo" placeholder="e.g 000987" maxlength="6"></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" label="Client's Contact Information" grouped group-multiline>
				<b-field>
					<b-input v-model="name" placeholder="Name and Surname"></b-input>
				</b-field>
				<b-field expanded>
					<b-input v-model="address" placeholder="Address"></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" grouped group-multiline>
				<b-field>
					<b-input v-model="city" placeholder="City"></b-input>
				</b-field>
				<b-field expanded>
					<b-input v-model="postCode" placeholder="Post Code"></b-input>
				</b-field>
				<b-field>
					<p class="control">
						<span class="button is-static">+370</span>
					</p>
					<b-input v-model="phone" placeholder="66749666" expanded></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" label="Order Information" grouped group-multiline>
				<b-field>
					<b-input v-model="productsCodes" placeholder="Product codes"></b-input>
				</b-field>
				<b-field>
					<b-input v-model="size" placeholder="Size"></b-input>
				</b-field>
				<b-field expanded>
					<b-input v-model="description" placeholder="Products Description"></b-input>
				</b-field>
			</b-field>

			<b-field class="clientSection2">
				<b-numberinput
					:controls="false"
					class="euro"
					v-model="orderValue"
					step="0.01"
					placeholder="Order value"
				></b-numberinput>
				<p class="control">
					<span class="button is-static">
						<i class="fas fa-euro-sign"></i>
					</span>
				</p>
			</b-field>

			<b-field label="Delivery Information" grouped group-multiline>
				<b-field>
					<b-select
						v-model="deliveryMeth"
						@input="deliveryDependency()"
						placeholder="Select delivery method"
					>
						<option
							v-for="option in deliveryMethods"
							:value="option.method"
							:key="option.id"
						>{{ option.method }}</option>
					</b-select>
				</b-field>
				<b-field>
					<b-select id="omnivaSelect" v-model="omniva" v-if="omnivaSelection"></b-select>
					<b-input v-model="lpExpress" v-if="lpExpressSelection" placeholder="Post terminal name"></b-input>
				</b-field>
			</b-field>
			<b-field class="clientSection2">
				<b-numberinput
					:controls="false"
					class="euro"
					v-model="delPrice"
					step="0.01"
					placeholder="Delivery Price"
				></b-numberinput>
				<p class="control">
					<span class="button is-static">
						<i class="fas fa-euro-sign"></i>
					</span>
				</p>
			</b-field>

			<b-field label="Status Information" grouped group-multiline>
				<div class="field">
					<b-checkbox v-model="payment">PAID</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox v-model="ordered">Ordered from supplier</b-checkbox>
				</div>
				<div class="field">
					<b-checkbox v-model="sent">Sent to Client</b-checkbox>
				</div>
			</b-field>

			<b-field class="sectionWidth" grouped group-multiline>
				<b-field>
					<b-input v-model="tracking" placeholder="Tracking no."></b-input>
				</b-field>
				<b-field>
					<b-input v-model="supplierNo" placeholder="Supplier order no."></b-input>
				</b-field>
			</b-field>

			<b-button native-type="submit" :type="btnType">Confirm</b-button>
		</form>
	</div>
</template>

<script>
	import Notification from "../components/Notification";
	import firebase from "firebase/app";
	import "firebase/firestore";

	export default {
		name: "AddOrder",
		components: {
			Notification,
		},
		data() {
			return {
				date: new Date(),
				deliveryMethods: [
					{ id: 1, method: "Lietuvos paštas" },
					{ id: 2, method: "Omniva" },
					{ id: 3, method: "LP EXPRESS" },
					{ id: 4, method: "Kita" },
				],
				omnivaSelection: false,
				lpExpressSelection: false,
				isActive: false,
				errorMessage: "",
				notifType: "",
				btnType: "is-primary",
				orderNo: "",
				name: "",
				address: "",
				city: "",
				postCode: "",
				phone: "",
				productsCodes: "",
				size: "",
				description: "",
				orderValue: "",
				deliveryMeth: "",
				omniva: "",
				lpExpress: "",
				delPrice: "",
				payment: false,
				ordered: false,
				sent: false,
				tracking: "",
				supplierNo: "",
			};
		},
		methods: {
			deliveryDependency() {
				const eventValue = event.target.value;

				if (eventValue === "Omniva") {
					//fetch Post terminals from Omniva API if Omniva selected
					this.lpExpressSelection = false;
					this.lpExpress = "";
					fetch(
						`https://cors-anywhere.herokuapp.com/https://www.omniva.ee/locations.json`
					)
						.then((res) => {
							this.omnivaSelection = true; // first need to show input to queryselect in next "then"
							return res.json();
						})
						.then((data) => {
							const omnivaSelect = document.querySelector("#omnivaSelect");
							data
								.filter((item) => item.A0_NAME === "LT") // filter only lithuanian post terminals
								.forEach((element) => {
									const option = document.createElement("option");
									option.textContent = element.NAME;
									option.value = element.NAME;
									omnivaSelect.append(option);
								});
						});
				} else if (eventValue === "LP EXPRESS") {
					this.omnivaSelection = false; // hide input needed if we change between delivery methods
					this.lpExpressSelection = true;
					this.omniva = ""; //overwrite information if previously client selected
				} else {
					this.omnivaSelection = false;
					this.lpExpressSelection = false;
					this.omniva = ""; //overwrite information if previously client selected other method
					this.lpExpress = "";
				}
			},

			add() {
				this.btnType = "is-primary is-loading";
				firebase
					.firestore()
					.collection("orders")
					.add({
						date: this.date,
						orderNo: this.orderNo,
						name: this.name,
						address: this.address,
						city: this.city,
						postCode: this.postCode,
						phone: this.phone,
						productsCodes: this.productsCodes,
						size: this.size,
						description: this.description,
						orderValue: this.orderValue,
						deliveryMeth: this.deliveryMeth,
						omniva: this.omniva,
						lpExpress: this.lpExpress,
						delPrice: this.delPrice,
						payment: this.payment,
						ordered: this.ordered,
						sent: this.sent,
						tracking: this.tracking,
						supplierNo: this.supplierNo,
					})
					.then(() => {
						this.btnType = "is-primary";
						this.isActive = true;
						this.notifType = "is-light is-success";
						this.errorMessage = "You have added order successfully.";
					})
					.catch((error) => {
						this.btnType = "is-primary";
						this.isActive = true;
						this.notifType = "is-light is-danger";
						this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error:${error.message}`;
					});
			},
		},
	};
</script>

<style scoped>
	.sectionWidth {
		max-width: 960px;
	}
	form > .field {
		padding-bottom: 10px;
	}
	.euro {
		max-width: 120px;
	}
</style>
