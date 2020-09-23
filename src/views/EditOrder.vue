<template>
	<div class="editOrder">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />
		<form v-on:submit.prevent="update">
			<b-field grouped group-multiline>
				<b-field label="Order Date">
					<b-datepicker
						class="client"
						v-model="date"
						:first-day-of-week="1"
						placeholder="Click to select..."
						locale="lt-LT"
						required
					>
						<button
							class="button is-primary"
							@click.prevent="date = new Date()"
						>
							<b-icon icon="calendar-today"></b-icon>
							<span>Today</span>
						</button>

						<button class="button is-danger" @click.prevent="date = null">
							<b-icon icon="close"></b-icon>
							<span>Clear</span>
						</button>
					</b-datepicker>
				</b-field>

				<b-field class="orderBlock" label="Order No.">
					<p class="subtitle">{{ this.id }}</p>
				</b-field>
			</b-field>

			<b-field
				class="sectionWidth"
				label="Client's Contact Information"
				grouped
				group-multiline
			>
				<b-field>
					<b-input
						class="inputClass"
						v-model="name"
						placeholder="Name and Surname"
						required
					></b-input>
				</b-field>
				<b-field expanded>
					<b-input
						class="inputClass"
						v-model="address"
						placeholder="Address"
					></b-input>
				</b-field>
			</b-field>

			<b-field class="sectionWidth" grouped group-multiline>
				<b-field>
					<b-input
						class="inputClass"
						v-model="city"
						placeholder="City"
					></b-input>
				</b-field>
				<b-field expanded>
					<b-input
						class="inputClass"
						v-model="postCode"
						placeholder="Post Code"
					></b-input>
				</b-field>
				<b-field>
					<p class="control">
						<span class="button is-static">+370</span>
					</p>
					<b-input
						class="inputClass"
						v-model="phone"
						placeholder="66749666"
						expanded
					></b-input>
				</b-field>
			</b-field>

			<b-field
				class="sectionWidth"
				label="Order Information"
				grouped
				group-multiline
			>
				<b-field expanded>
					<b-input
						v-model="description"
						placeholder="Products Description"
					></b-input>
				</b-field>

				<b-field>
					<b-input class="small" v-model="size" placeholder="Size"></b-input>
				</b-field>

				<b-field>
					<b-input v-model="productsCode" placeholder="Product Code"></b-input>
				</b-field>

				<b-field>
					<b-numberinput
						:controls="false"
						v-model="quantity"
						class="small"
						step="1"
						placeholder="1"
					></b-numberinput>
				</b-field>

				<b-field>
					<b-numberinput
						:controls="false"
						class="small"
						v-model="price"
						step="0.01"
						placeholder="€/pc"
					></b-numberinput>
				</b-field>
				<b-button @click="addproduct()" rounded size="is-small">
					<i class="fas fa-plus"></i>
				</b-button>
			</b-field>

			<b-field>
				<b-table
					class="sectionWidth"
					:data="products"
					v-if="showTable"
					hoverable
					mobile-cards
				>
					<b-table-column
						field="description"
						label="Description"
						centered
						v-slot="props"
						>{{ props.row.description }}</b-table-column
					>
					<b-table-column field="size" label="Size" centered v-slot="props">{{
						props.row.size
					}}</b-table-column>
					<b-table-column
						field="productsCode"
						label="Product Code"
						centered
						v-slot="props"
						>{{ props.row.productsCode }}</b-table-column
					>
					<b-table-column
						field="quantity"
						label="Quantity"
						centered
						v-slot="props"
						>{{ props.row.quantity }}</b-table-column
					>
					<b-table-column field="price" label="Price" centered v-slot="props">{{
						props.row.price
					}}</b-table-column>
					<b-table-column field="action" label="Action" centered v-slot="props">
						<b-button
							@click="removeFromTable(props.row.id)"
							type="is-text"
							size="is-small"
						>
							<i class="fas fa-trash-alt"></i>
						</b-button>
					</b-table-column>
				</b-table>
			</b-field>
			<b-field label="Delivery Information" grouped group-multiline>
				<b-field>
					<b-select
						class="inputClass"
						v-model="deliveryMeth"
						@input="deliveryDependency()"
						placeholder="Select delivery method"
					>
						<option
							v-for="option in deliveryMethods"
							:value="option.method"
							:key="option.id"
						>
							{{ option.method }}
						</option>
					</b-select>
				</b-field>
				<b-field>
					<b-select
						id="omnivaSelect"
						class="inputClass"
						v-model="omniva"
						:loading="selectLoader"
						placeholder="Select Omniva terminal"
						v-if="omnivaSelection"
					></b-select>
					<b-input
						v-model="lpExpress"
						v-if="lpExpressSelection"
						placeholder="Post terminal name"
					></b-input>
				</b-field>
			</b-field>
			<b-field>
				<b-numberinput
					:controls="false"
					class="euro inputClass"
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
					<b-input
						class="inputClass"
						v-model="tracking"
						placeholder="Tracking no."
					></b-input>
				</b-field>
				<b-field>
					<b-input
						class="inputClass"
						v-model="supplierNo"
						placeholder="Supplier order no."
					></b-input>
				</b-field>
			</b-field>

			<div class="buttons">
				<b-button native-type="submit" :type="btnType">Update</b-button>
				<b-button
					class="gap"
					@click="deleteSelected()"
					type="is-danger"
					icon-left="delete"
				></b-button>
			</div>
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
				date: null,
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
				id: "",
				name: "",
				address: "",
				city: "",
				postCode: "",
				phone: "",
				productsCode: "",
				size: "",
				description: "",
				deliveryMeth: null,
				omniva: null,
				lpExpress: "",
				delPrice: null,
				payment: false,
				ordered: false,
				sent: false,
				tracking: "",
				supplierNo: "",
				selectLoader: false,
				successMessage: "",
				products: [],
				price: null,
				quantity: null,
				showTable: false,
			};
		},
		methods: {
			deliveryDependency() {
				if (this.deliveryMeth === "Omniva") {
					//fetch Post terminals from Omniva API if Omniva selected
					this.lpExpressSelection = false;
					this.lpExpress = null;
					this.omnivaSelection = true; // first need to show input to queryselect in "then"
					this.selectLoader = true;
					fetch(
						`https://cors-anywhere.herokuapp.com/https://www.omniva.ee/locations.json`
					)
						.then((res) => res.json())
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
						})
						.then(() => (this.selectLoader = false))
						.catch((error) => {
							this.isActive = true;
							this.notifType = "is-light is-danger";
							this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error: "${error.message}"`;
						});
				} else if (this.deliveryMeth === "LP EXPRESS") {
					this.omnivaSelection = false; // hide input needed if we change between delivery methods
					this.lpExpressSelection = true;
					this.omniva = null; //overwrite information if previously client selected
				} else {
					this.omnivaSelection = false;
					this.lpExpressSelection = false;
					this.omniva = null; //overwrite information if previously client selected other method
					this.lpExpress = null;
				}
			},

			update() {
				this.btnType = "is-primary is-loading";
				firebase
					.firestore()
					.collection("orders")
					.doc(this.$route.params.id)
					.set({
						date: this.date,
						name: this.name,
						address: this.address,
						city: this.city,
						postCode: this.postCode,
						phone: this.phone,
						deliveryMeth: this.deliveryMeth,
						omniva: this.omniva,
						lpExpress: this.lpExpress,
						delPrice: this.delPrice,
						payment: this.payment,
						ordered: this.ordered,
						sent: this.sent,
						tracking: this.tracking,
						supplierNo: this.supplierNo,
						products: this.products,
					})
					.then(() => {
						this.successMessage = "You have updated an order successfully.";
						this.success();
						this.btnType = "is-primary";
					})
					.catch((error) => {
						this.btnType = "is-primary";
						this.isActive = true;
						this.notifType = "is-light is-danger";
						this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error:${error.message}`;
					});
			},
			success() {
				this.$buefy.notification.open({
					message: this.successMessage,
					type: "is-success",
					position: "is-top",
				});
			},
			deleteSelected() {
				firebase
					.firestore()
					.collection("orders")
					.doc(this.$route.params.id)
					.delete()
					.then(() => {
						this.successMessage = "You have deleted an order successfully.";
						this.success();
						this.$router.push("/orders");
					})
					.catch((error) => {
						this.isActive = true;
						this.notifType = "is-light is-danger";
						this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error:${error.message}`;
					});
			},
			addproduct() {
				this.showTable = true;
				this.products.push({
					id: this.products.length + 1 || 1,
					description: this.description,
					size: this.size,
					productsCode: this.productsCode,
					quantity: this.quantity,
					price: this.price,
				});
			},
			removeFromTable(a) {
				const index = this.products.map((item) => item.id).indexOf(a);
				this.products.splice(index, 1);

				if (!this.products.length) {
					this.showTable = false;
				}
			},
		},
		beforeMount() {
			firebase
				.firestore()
				.collection("orders")
				.doc(this.$route.params.id)
				.get()
				.then((doc) => {
					if (doc.data()) {
						this.id = doc.id;
						doc.data().date
							? (this.date = doc.data().date.toDate())
							: (this.date = null);
						this.name = doc.data().name;
						this.address = doc.data().address;
						this.city = doc.data().city;
						this.postCode = doc.data().postCode;
						this.phone = doc.data().phone;
						this.size = doc.data().size;
						this.description = doc.data().description;
						this.orderValue = doc.data().orderValue || 0;
						this.deliveryMeth = doc.data().deliveryMeth;
						this.omniva = doc.data().omniva;
						this.lpExpress = doc.data().lpExpress;
						this.delPrice = doc.data().delPrice || 0;
						this.payment = doc.data().payment;
						this.ordered = doc.data().ordered;
						this.sent = doc.data().sent;
						this.tracking = doc.data().tracking;
						this.supplierNo = doc.data().supplierNo;

						doc.data().products.forEach((item) => {
							this.products.push({
								id: this.products.length + 1 || 1,
								description: item.description,
								size: item.size,
								productsCode: item.productsCode,
								quantity: item.quantity,
								price: item.price,
							});
						});
					}
				})
				.then(() => {
					this.showTable = true;
					this.deliveryDependency(); //to show inputs depending on delivery meth client selected
				})
				.catch((error) => {
					this.isActive = true;
					this.notifType = "is-light is-danger";
					this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error: "${error.message}"`;
				});
		},
	};
</script>

<style scoped>
	.sectionWidth {
		max-width: 960px;
	}
	.inputClass {
		margin-bottom: 5px;
	}
	.euro {
		max-width: 120px;
	}
	.gap,
	.orderBlock {
		margin-left: 60px;
	}
	.subtitle {
		padding-top: 5px;
	}
	.client {
		margin-bottom: 15px;
	}
	.small {
		max-width: 120px;
	}
</style>
