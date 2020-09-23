<template>
	<div class="viewOrders">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />
		<b-table :data="data" hoverable mobile-cards>
			<b-table-column
				field="orderNo"
				label="Order No."
				sortable
				searchable
				centered
				width="98"
				v-slot="props"
			>{{ props.row.orderNo }}</b-table-column>
			<b-table-column field="name" label="Name" sortable searchable v-slot="props">{{ props.row.name }}</b-table-column>
			<b-table-column field="date" label="Date" sortable searchable centered v-slot="props">
				<span
					class="tag is-primary"
				>{{ (props.row.date!=="") ? new Date(props.row.date).toLocaleDateString() : "No Date" }}</span>
				<!-- If no date in database show string -->
			</b-table-column>
			<b-table-column
				field="description"
				label="Description"
				sortable
				searchable
				v-slot="props"
			>{{props.row.description}}</b-table-column>
			<b-table-column
				field="deliveryMeth"
				label="Delivery Method"
				sortable
				searchable
				v-slot="props"
			>{{ props.row.deliveryMeth }}</b-table-column>
			<b-table-column
				field="orderValue"
				label="Order Value"
				sortable
				searchable
				centered
				width="98"
				v-slot="props"
			>{{ props.row.orderValue }} &euro;</b-table-column>
			<b-table-column field="status" label="Status" sortable searchable v-slot="props" class="red">
				<span
					:class="['tag', status(props.row.payment, props.row.ordered, props.row.sent).status]"
				>{{status(props.row.payment, props.row.ordered, props.row.sent).message}}</span>
			</b-table-column>
			<b-table-column field="action" centered width="120" label="Action" v-slot="props">
				<b-button
					class="actionBtn"
					tag="router-link"
					type="is-primary"
					outlined
					size="is-small"
					:to="/edit-order/ + props.row.id"
				>
					<i class="far fa-edit"></i>
				</b-button>
				<b-button
					tag="router-link"
					type="is-primary"
					outlined
					size="is-small"
					:to="/info-order/ + props.row.id"
				>
					<i class="fas fa-info-circle"></i>
				</b-button>
			</b-table-column>
		</b-table>
	</div>
</template>

<script>
	import Notification from "../components/Notification";
	import firebase from "firebase/app";
	import "firebase/firestore";

	export default {
		name: "ViewOrders",
		components: {
			Notification,
		},
		data() {
			return {
				data: [],
				isActive: false,
				errorMessage: "",
				notifType: "",
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
				.get()
				.then((snapshot) =>
					snapshot.docs.forEach((doc) =>
						this.data.push({
							id: doc.id,
							date: doc.data().date ? doc.data().date.toDate() : "",
							orderNo: doc.data().orderNo,
							name: doc.data().name,
							address: doc.data().address,
							city: doc.data().city,
							postCode: doc.data().postCode,
							phone: doc.data().phone,
							productsCodes: doc.data().productsCodes,
							size: doc.data().size,
							description: doc.data().description,
							orderValue: doc.data().orderValue || 0,
							deliveryMeth: doc.data().deliveryMeth,
							omniva: doc.data().omniva,
							lpExpress: doc.data().lpExpress,
							delPrice: doc.data().delPrice || 0,
							payment: doc.data().payment,
							ordered: doc.data().ordered,
							sent: doc.data().sent,
							tracking: doc.data().tracking,
							supplierNo: doc.data().supplierNo,
						})
					)
				)
				.then(() => console.log(this.data))
				.catch((error) => {
					this.isActive = true;
					this.notifType = "is-light is-danger";
					this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error: "${error.message}"`;
				});
		},
	};
</script>
<style scoped>
	.actionBtn {
		margin-right: 5px;
	}
</style>