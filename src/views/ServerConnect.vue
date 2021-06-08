<template>
  <h1>{{ serverName }}</h1>
  <div id="parent">
    <div id="top">
      <div id="characterDisplay"></div>
      <div id="icMessages">
        <p v-for="(packet, index) in icMessages" :key="index">
          {{ packet.message }}
        </p>
      </div>
    </div>
    <div id="bottom">
      {{ areas() }}
      <div>
        <h1>Available Characters</h1>
        <div v-for="(character, index) in characters" :key="index">
          <div v-if="characterStatus[index] != -1">
            {{ character }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import MusicDisplay from "../components/musicDisplay";
import msParser from "../network/ms_parse";
import scParser from "../network/sc_parse";
import charsCheckParser from "../network/chars_check";
import smParser from "../network/sm_parse";

const ServerConnect = defineComponent({
  // components: { MusicDisplay },
  data() {
    return {
      serverName: "" ,
      assetURL: "",
      characters: [] as Array<String>,
      musicAndAreas: [] as Array<String>,
      characterStatus: [] as Array<String>,
      icMessages: [] as Array<Object>,
      charId: -1,
      socket: this.connect(),
    };
  },
  mounted() {
    this.serverName = String(this.$route.query.name);
    this.assetURL = String(this.$route.query.assetUrl);
    let self = this;
    this.socket.onopen = function () {
      self.socket.send("HI#582d5c62d44e51c0d145466ccfe396a9#%");
      self.socket.send("ID#webAO#webAO#%");
      self.socket.send("RC#%");
      self.socket.send("RM#%");
      self.socket.send("RD#%");
    };

    this.socket.onmessage = function (event: { data: string }) {
      const packet = event.data;

      if (packet.startsWith("MS")) {
        self.icMessages.push(msParser(packet));
      } else if (packet.startsWith("SC")) {
        self.characters = scParser(packet);
      } else if (packet.startsWith("CharsCheck")) {
        self.characterStatus = charsCheckParser(packet);
      } else if (packet.startsWith("ASS")) {
        self.assetURL = packet.split("#")[1];
      } else if (packet.startsWith("SM")) {
        self.musicAndAreas = smParser(packet);
      } else if (packet.startsWith("CHECK")) {
        self.socket.send(`CH#${self.charId}#%`);
      }
      console.log(event.data)
    };
  },

  methods: {
    connect() {
      return new WebSocket(
        `ws://${this.$route.query.ip}:${this.$route.query.port}`
      );
    },
    areas() {
      if (!this.musicAndAreas) {
        return [];
      }
      const startMusicHeader = this.musicAndAreas.filter((item: String) =>
        item.includes("=")
      );

      if (startMusicHeader) {
        const index = this.musicAndAreas.indexOf(startMusicHeader[0]);
        return this.musicAndAreas.slice(0, index);
      }
      return [];
    },
    music(): Array<String> {
      if (!this.musicAndAreas) {
        return [];
      }
      const startMusicHeader = this.musicAndAreas.filter(item => item.includes("="));
      if (startMusicHeader) {
        const index = this.musicAndAreas.indexOf(startMusicHeader[0]);
        return this.musicAndAreas.slice(index);
      }
      return [];
    },
  }
});
export default ServerConnect;
</script>

<style>
#icMessages {
  width: 200px;
  height: 200px;
  overflow-x: scroll;
  background-color: lightblue;
}
</style>