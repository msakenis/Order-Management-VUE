<template>
	<div class="orderInformation">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />

		<section class="card">
			<b-button tag="router-link" type="is-text" outlined size="is-small" :to="/edit-order/ + this.id">
				<i class="far fa-edit"></i>
			</b-button>
			<div class="card-content">
				<h1 class="title is-4">
					<i class="fas fa-hashtag"></i>
					Order No. {{this.orderNo}}
				</h1>
				<div class="columns">
					<div class="column">
						<p class="subtitle is-5">Order Information</p>
						<p class="dateText">
							<strong>Order Date:</strong>
							{{this.date}}
						</p>
						<p>
							<strong>Order Status:</strong>
							<span
								id="tagger"
								:class="['tag', status(this.payment, this.ordered, this.sent).status]"
							>{{ status(this.payment, this.ordered, this.sent).message}}</span>
						</p>
					</div>
					<div class="column">
						<p class="subtitle is-5">Client Information</p>
						<p class="dateText">
							<strong>Client Name:</strong>
							{{this.name}}
						</p>
						<p>
							<strong>Phone Number:</strong>
							+370 {{this.phone}}
						</p>
					</div>
				</div>
				<b-tabs>
					<b-tab-item label="Products">
						<table class="table is-fullwidth">
							<thead>
								<th>Product Codes</th>
								<th>Sizes</th>
								<th>Product Description</th>
								<th>Order Value</th>
							</thead>
							<tbody>
								<tr>
									<td>{{this.productsCodes}}</td>
									<td>{{this.size}}</td>
									<td>{{this.description}}</td>
									<td>{{this.orderValue}} &euro;</td>
								</tr>
							</tbody>
						</table>
					</b-tab-item>

					<b-tab-item label="Delivery Information">
						<table class="table">
							<thead>
								<th>Delivery Method</th>
								<th>Delivery Info</th>
								<th>Delivery Price</th>
							</thead>
							<tbody>
								<tr>
									<td>{{this.deliveryMeth}}</td>
									<td>{{this.omniva ? this.omniva : this.lpExpress}}</td>
									<td>{{this.delPrice}} &euro;</td>
								</tr>
							</tbody>
							<thead>
								<th>Shippment Address</th>
								<th>Tracking no.</th>
								<th>Supplier order no.</th>
							</thead>
							<tbody>
								<tr>
									<td>{{this.address +" "+ this.city +" "+ this.postCode}}</td>
									<td>{{this.tracking}}</td>
									<td>{{this.supplierNo}}</td>
								</tr>
							</tbody>
						</table>
					</b-tab-item>
				</b-tabs>
			</div>
		</section>
	</div>
</template>

<script>
	import Notification from "../components/Notification";
	import firebase from "firebase/app";
	import "firebase/firestore";

	export default {
		name: "OrderInformation",
		components: {
			Notification,
		},
		data() {
			return {
				isActive: false,
				errorMessage: "",
				notifType: "",
				date: null,
				orderNo: "",
				name: "",
				address: "",
				city: "",
				postCode: "",
				phone: "",
				productsCodes: "",
				size: "",
				description: "",
				orderValue: null,
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
				id: "",
			};
		},
		methods: {
			status(payment, ordered, sent) {
				if (!payment && !ordered && !sent) {
					return { status: "is-info", message: "WAITING FOR PAYMENT" };
				} else if (payment && !ordered && !sent) {
					return { status: "is-warning", message: "NEED TO ORDER" };
				} else if (payment && ordered && !sent) {
					return { status: "is-dark", message: "WAITING FOR DELIVERY" };
				} else if (payment && ordered && sent) {
					return { status: "is-success", message: "WAITING FOR CONFIRMATION" };
				} else if (!payment && ordered && !sent) {
					return {
						status: "is-danger is-light",
						message: "WAIT FOR PAYMENT(ORDERED)",
					};
				} else
					return {
						status: "is-danger",
						message: "You cannot send goods without payment!",
					};
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
						this.date = doc.data().date
							? new Date(doc.data().date.toDate()).toLocaleDateString("lt-LT")
							: "No Date";
						this.orderNo = doc.data().orderNo;
						this.name = doc.data().name;
						this.address = doc.data().address;
						this.city = doc.data().city;
						this.postCode = doc.data().postCode;
						this.phone = doc.data().phone;
						this.productsCodes = doc.data().productsCodes;
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
					}
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
	.title {
		text-align: center;
	}
	.dateText {
		margin-bottom: 5px;
	}
	#tagger {
		margin-left: 10px;
	}
	.card {
		min-height: 70vh;
	}
	thead {
		margin-top: 20px;
	}
</style>