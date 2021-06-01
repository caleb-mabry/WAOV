<template>
  <div style="display: flex; flex-wrap: wrap">
    <serverDisplay :servers="serverCreater" />
  </div>
</template>

<script>
import serverDisplay from "@/components/serverDisplay";
import { mapMutations } from 'vuex'
export default {
  name: "App",
  components: {
    serverDisplay,
  },
  data() {
    return {
      serverInformation: [],
    };
  },
  beforeMount() {
    this.connection = new WebSocket("ws://master.aceattorneyonline.com:27014/");
    
    let self = this;
    this.connection.onmessage = function (event) {
      const packet = event.data

      if (packet === "servercheok#2.6.0#%") {
        self.connection.send("ALL#%");
      }
      if (packet.startsWith("ALL")) {
        self.serverInformation = packet.split("#");
        self.serverInformation.shift();
        self.serverInformation.unshift();
      }
      console.log(packet)
    };
  },
  computed: {
    ...mapMutations(
        ['setServerList']
    ),
    serverCreater() {
    
      if (this.serverInformation == []) {
        return "";
      }


      const parsed_server_info = this.serverInformation.map((item) => {
        const split = item.split("&");
        const name = split[0];
        const description = split[1];
        const ip = split[2];
        const port = split[3];
        const assetUrl = split[4]
        return { name, description, ip, port, assetUrl };
      });
      this.$store.commit('setServerList', parsed_server_info)
      return parsed_server_info;
    },
  },
};
</script>

<style>
</style>