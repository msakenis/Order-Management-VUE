<template>
	<div class="viewOrders">
		<Notification v-if="isActive" :type="notifType" :message="errorMessage" />
		<b-table :data="data">
			<b-table-column field="orderNo" label="Order No." sortable v-slot="props">{{ props.row.orderNo }}</b-table-column>
			<b-table-column field="name" label="Name" sortable v-slot="props">{{ props.row.name }}</b-table-column>
			<b-table-column field="date" label="Date" sortable centered v-slot="props">
				<span
					class="tag is-primary"
				>{{ (props.row.date!=="") ? new Date(props.row.date).toLocaleDateString("lt") : "No Date" }}</span>
				<!-- If no date in database show string -->
			</b-table-column>
			<b-table-column
				field="description"
				label="Description"
				sortable
				v-slot="props"
			>{{props.row.description}}</b-table-column>
			<b-table-column
				field="deliveryMeth"
				label="Delivery Method"
				sortable
				v-slot="props"
			>{{ props.row.deliveryMeth }}</b-table-column>
			<b-table-column field="action" label="Action" v-slot="props">
				<b-button
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
							orderValue: doc.data().orderValue,
							deliveryMeth: doc.data().deliveryMeth,
							omniva: doc.data().omniva,
							lpExpress: doc.data().lpExpress,
							delPrice: doc.data().delPrice,
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