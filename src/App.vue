<template>
  <router-link to="/">Server Select</router-link>
  <router-view />
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class App extends Vue {}
</script>

<style>
html {
  background-color: #1a203c;
}
a {
  color: #f3f7fb;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #f3f7fb;
  /* margin-top: 60px; */
}
</style>
