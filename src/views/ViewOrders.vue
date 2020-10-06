<template>
  <div class="viewOrders">
    <Notification v-if="isActive" :type="notifType" :message="errorMessage" />
    <b-loading
      :is-full-page="false"
      v-model="isLoading"
      :can-cancel="true"
    ></b-loading>
    <transition name="fade" mode="out-in">
      <b-table v-if="showData" :data="data" hoverable mobile-cards>
        <b-table-column
          field="id"
          label="Order No."
          sortable
          searchable
          centered
          width="98"
          v-slot="props"
          >{{ props.row.id }}</b-table-column
        >
        <b-table-column
          field="name"
          label="Name"
          sortable
          searchable
          v-slot="props"
          >{{ props.row.name }}</b-table-column
        >
        <b-table-column
          field="date"
          width="98"
          label="Date"
          sortable
          searchable
          centered
          v-slot="props"
        >
          <span class="tag is-primary">{{ props.row.date }}</span>
        </b-table-column>
        <b-table-column
          field="description"
          label="Description"
          sortable
          searchable
          v-slot="props"
          >{{ props.row.description }}</b-table-column
        >
        <b-table-column
          field="deliveryMeth"
          label="Delivery Method"
          sortable
          width="150"
          searchable
          v-slot="props"
          >{{ props.row.deliveryMeth }}</b-table-column
        >
        <b-table-column
          field="orderValue"
          label="Order Value"
          sortable
          searchable
          centered
          width="110"
          v-slot="props"
          >{{
            props.row.orderValue + props.row.delPrice
          }}
          &euro;</b-table-column
        >
        <b-table-column
          field="status"
          label="Status"
          sortable
          searchable
          v-slot="props"
          class="red"
        >
          <span
            :class="[
              'tag',
              status(props.row.payment, props.row.ordered, props.row.sent)
                .status,
            ]"
            >{{ props.row.status }}</span
          >
          <b-tooltip
            v-if="props.row.note != null"
            class="note"
            position="is-bottom"
            type="is-light"
            multilined
          >
            <i class="far fa-comment"></i>
            <template v-slot:content>
              {{ props.row.note }}
            </template>
          </b-tooltip>
        </b-table-column>
        <b-table-column
          field="action"
          centered
          width="120"
          label="Action"
          v-slot="props"
        >
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
      <b-message type="is-warning" has-icon v-else>{{
        messageOrders
      }}</b-message>
    </transition>
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
      showData: true,
      isLoading: true,
      messageOrders: "",
    };
  },
  methods: {
    // method checks and returns status message and type of tag to display
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
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 10 * 1000);

    firebase
      .firestore()
      .collection("orders")
      .get()
      .then((snapshot) => {
        console.log(snapshot.docs);
        if (snapshot.docs.length !== 0) {
          snapshot.docs.forEach((doc) => {
            this.showData = true;
            this.isLoading = false;
            let desc = "";
            let orderValue = 0;
            doc.data().products.forEach((item) => {
              desc = desc + item.description + " ";
              orderValue = orderValue + item.price;
            });
            this.data.push({
              id: doc.id,
              date: doc.data().date
                ? new Date(doc.data().date.toDate()).toLocaleDateString("lt-LT")
                : "No Date", //converts the date to LT and threre is no date enter string "no date"
              name: doc.data().name,
              description: desc,
              orderValue: orderValue,
              deliveryMeth: doc.data().deliveryMeth,
              delPrice: doc.data().delPrice,
              payment: doc.data().payment,
              ordered: doc.data().ordered,
              sent: doc.data().sent,
              note: doc.data().note,
              status: this.status(
                //checks parameters in database and runs f which state the status of order
                doc.data().payment,
                doc.data().ordered,
                doc.data().sent
              ).message,
            });
          });
        } else {
          this.messageOrders =
            'There are no active Orders. Please add new an new order by clicking "Add Order" above.';
          this.showData = false;
          this.isLoading = false;
        }
      })
      .then(() => this.data.sort((a, b) => b.id - a.id))
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
.note {
  margin-left: 10px;
}

/* CSS for transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
