<template>
    <div v-for="server in servers" :key="server.ip" class="card">
      <h1>{{ server.name }}</h1><br />
      {{ server.description }}<br />
      {{ server.ip }}<br />
      {{ server.port }}<br />
      <router-link :to="{ path: 'server', query: { name: server.name, ip: server.ip, port: server.port, assetUrl: server.assetUrl }}">Join</router-link>
  </div>
</template>

<script>

export default {
  props: ['servers']
}
</script>

<style scoped>
.card {
  width: 25%;
  margin: 3%;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  border-radius: 5px; /* 5px rounded corners */
}
</style>