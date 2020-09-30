<template>
  <div id="app">
    <div class="container">
      <Navigation />
    </div>

    <section class="section hero is-light is-bold">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">{{ $route.name }}</h1>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="container">
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
