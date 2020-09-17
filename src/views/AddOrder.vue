<template>
  <div class="addOrder">
    <form>
      <b-field grouped group-multiline>
        <b-field label="Order Date">
          <b-datepicker
            v-model="date"
            :first-day-of-week="1"
            placeholder="Click to select..."
            locale="lt-LT"
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
          <b-input
            placeholder="e.g 000987"
            maxlength="6"
            v-model="orderNo"
          ></b-input>
        </b-field>
      </b-field>

      <b-field
        class="clientSection"
        label="Client's Contact Information"
        grouped
        group-multiline
      >
        <b-field>
          <b-input v-model="name" placeholder="Name and Surname"></b-input>
        </b-field>
        <b-field expanded>
          <b-input placeholder="Address"></b-input>
        </b-field>
      </b-field>

      <b-field class="clientSection clientSection2" grouped group-multiline>
        <b-field>
          <b-input placeholder="City"></b-input>
        </b-field>
        <b-field expanded>
          <b-input placeholder="Post Code"></b-input>
        </b-field>
        <b-field>
          <p class="control">
            <span class="button is-static">+370</span>
          </p>
          <b-input placeholder="66749666" expanded></b-input>
        </b-field>
      </b-field>

      <b-field label="Order Information" grouped group-multiline>
        <b-field>
          <b-input v-model="name" placeholder="Name and Surname"></b-input>
        </b-field>
      </b-field>
    </form>
  </div>
</template>

<script>
export default {
  name: "AddOrder",
  data() {
    return {
      date: new Date(),
    };
  },
};
</script>

<style scoped>
.clientSection {
  max-width: 800px;
}
.clientSection2 {
  margin-top: 25px;
}
</style>
