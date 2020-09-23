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
        <b-field>
          <b-input
            class="inputClass"
            v-model="productsCodes"
            placeholder="Product codes"
          ></b-input>
        </b-field>
        <b-field>
          <b-input
            class="inputClass"
            v-model="size"
            placeholder="Size"
          ></b-input>
        </b-field>
        <b-field expanded>
          <b-input
            class="inputClass"
            v-model="description"
            placeholder="Products Description"
          ></b-input>
        </b-field>
      </b-field>

      <b-field>
        <b-numberinput
          :controls="false"
          class="euro inputClass"
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
            class="inputClass"
            v-model="deliveryMeth"
            @input="deliveryDependency()"
            placeholder="Select delivery method"
          >
            <option
              v-for="option in deliveryMethods"
              :value="option.method"
              :key="option.id"
              >{{ option.method }}</option
            >
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
      .then(() => {
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
.gap {
  margin-left: 60px;
}
.subtitle {
  padding-top: 5px;
}
.orderBlock {
  margin-left: 50px;
}
.client {
  margin-bottom: 15px;
}
</style>
