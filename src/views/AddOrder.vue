<template>
  <div class="addOrder">
    <Notification v-if="isActive" :type="notifType" :message="errorMessage" />
    <form v-on:submit.prevent="add">
      <!-- Order date and no section start -->
      <b-field class="sectionBlock sectionBottom" grouped group-multiline>
        <b-field label="Order Date">
          <b-datepicker
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

        <b-field label="Order No.">
          <b-numberinput
            :controls="false"
            v-model="nextOrderNo"
            step="1"
            min="100001"
            max="999999"
            required
          ></b-numberinput>
        </b-field>
      </b-field>
      <!-- Order date and no section end -->

      <!-- Clients info section start -->
      <b-field class="sectionBlock">
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
      </b-field>

      <b-field class="sectionWidth sectionBottom" grouped group-multiline>
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
      <!-- Clients info section end -->

      <b-field class="sectionBlock">
        <b-field
          class="sectionWidth sectionBottom"
          label="Order Information"
          grouped
          group-multiline
        >
          <b-field :type="fieldType" expanded>
            <b-input
              v-model="description"
              placeholder="Products Description"
            ></b-input>
          </b-field>

          <b-field>
            <b-input class="small" v-model="size" placeholder="Size"></b-input>
          </b-field>

          <b-field>
            <b-input
              v-model="productsCode"
              placeholder="Product Code"
            ></b-input>
          </b-field>

          <b-field :type="fieldType">
            <b-numberinput
              :controls="false"
              v-model="quantity"
              class="small"
              step="1"
              placeholder="pcs"
            ></b-numberinput>
          </b-field>

          <b-field :type="fieldType">
            <b-numberinput
              :controls="false"
              class="small"
              v-model="price"
              step="0.01"
              placeholder="€/pc"
            ></b-numberinput>
          </b-field>
          <b-button
            class="plusBtn"
            @click="addproduct()"
            type="is-primary"
            outlined
            rounded
            size="is-small"
          >
            <i class="fas fa-plus"></i>
          </b-button>
        </b-field>
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
            >{{
              props.row.quantity === 1
                ? props.row.quantity + " pc"
                : props.row.quantity + " pcs"
            }}</b-table-column
          >
          <b-table-column field="price" label="Price" centered v-slot="props"
            >{{ props.row.price }} &euro;</b-table-column
          >
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

      <b-field
        label="Delivery Information"
        class="sectionBlock"
        grouped
        group-multiline
      >
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
      <b-field class="sectionBottom">
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

      <b-field
        label="Status Information"
        class="sectionBlock"
        grouped
        group-multiline
      >
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

      <b-button native-type="submit" class="btn" :type="btnType"
        >Confirm</b-button
      >
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
      ids: [],
      nextOrderNo: null,
      products: [],
      price: null,
      quantity: null,
      showTable: false,
      fieldType: null,
    };
  },
  methods: {
    deliveryDependency() {
      const eventValue = event.target.value;

      if (eventValue === "Omniva") {
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
      } else if (eventValue === "LP EXPRESS") {
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

    add() {
      this.btnType = "is-primary is-loading";
      firebase
        .firestore()
        .collection("orders")
        .doc(`${this.nextOrderNo}`) //adds specific uniq order no. which generated by other method
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
          this.success(); //notofication
          this.generateOrderNo(); //after order added to data base to generate new order no. for other orders
          this.btnType = "is-primary";
          this.$router.push("/orders");
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
        message: "You have added order successfully.",
        type: "is-success",
        position: "is-top",
      });
    },
    generateOrderNo() {
      firebase //fetches all order numbers from db,
        .firestore() // pushes to array, finds the highest no +1 and returns new order no
        .collection("orders") // if no orders ins db, default order number set
        .get()
        .then((snapshot) =>
          snapshot.docs.forEach((doc) => {
            this.ids.push(doc.id);
            this.nextOrderNo =
              this.nextOrderNo !== null ? Math.max(...this.ids) + 1 : 100001;
          })
        )
        .catch((error) => {
          this.isActive = true;
          this.notifType = "is-light is-danger";
          this.errorMessage = `Please refresh, if the error persists - contact the administrator of the website. Error: "${error.message}"`;
        });
    },
    addproduct() {
      // method which adds products in table for further add to db
      if (this.description && this.quantity && this.price) {
        // validation if any entered
        this.showTable = true;
        this.fieldType = null;
        this.products.push({
          id: this.products.length + 1 || 1,
          description: this.description,
          size: this.size,
          productsCode: this.productsCode,
          quantity: this.quantity,
          price: this.price,
        });
      } else {
        // if required fields null opens notif and focuses field which needs to be filled
        this.$buefy.notification.open({
          message: "Please add Description, Quantity and Price",
          position: "is-top",
        });
        this.fieldType = "is-primary";
      }
    },
    removeFromTable(a) {
      // removes product from table
      const index = this.products.map((item) => item.id).indexOf(a); // finds the index of selected
      this.products.splice(index, 1); // removes by index

      if (!this.products.length) {
        // if last item from table removed, hides all table
        this.showTable = false;
      }
    },
  },
  beforeMount() {
    this.generateOrderNo(); // always generate uniq order no.
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
.small {
  max-width: 120px;
}
.plusBtn {
  margin-top: 4px;
}
.sectionBottom {
  margin-bottom: 30px;
}
.b-checkbox {
  margin-bottom: 15px;
}
.sectionBlock:not(:first-child) {
  border-top: 2px solid rgba(228, 217, 217, 0.541);
  padding-top: 10px;
}
.btn {
  margin-top: 20px;
}
</style>
