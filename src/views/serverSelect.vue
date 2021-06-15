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
        this.connection.onopen = function() {
        self.connection.send("HI#582d5c62d44e51c0d145466ccfe396a9#%");
        
        // If you do not send this on creation, you will get the wrong port 
        self.connection.send("ID#webAO#webAO#%");
    }
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
      return parsed_server_info;
    },
  },
};
</script>