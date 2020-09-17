<template>
  <div id="app">
    <div class="container">
      <Navigation />
    </div>

    <section class="section">
      <div class="container">
        <h1 class="title">{{ $route.name }}</h1>
        <router-view />
      </div>
    </section>
  </div>
</template>

<script>
import Navigation from "./components/Navigation";
export default {
  components: { Navigation },
};
</script>
