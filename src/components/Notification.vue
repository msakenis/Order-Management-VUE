<template>
  <section>
    <b-notification v-bind:type="type" aria-close-label="Close notification">
      {{ message }}
    </b-notification>
  </section>
</template>

<script>
export default {
  name: "Notification",
  props: {
    type: String,
    message: String,
  },
};
</script>
