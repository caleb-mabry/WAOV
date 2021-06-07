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
      <MusicDisplay :musicList="music" :assetURL="assetURL" />
      {{ areas }}
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

<script>
import msParser from "../network/ms_parse.js";
import scParser from "../network/sc_parse.js";
import charsCheckParser from "../network/chars_check.js";
import smParser from "../network/sm_parse.js";

import MusicDisplay from "../components/musicDisplay";

export default {
  name: "ServerConnect",
  components: { MusicDisplay },
  data() {
    return {
      serverName: "",
      assetURL: "",
      characters: [],
      musicAndAreas: [],
      characterStatus: [],
      icMessages: [],
      charId: -1,
    };
  },
  mounted() {
    let { name, ip, port, assetUrl } = this.$route.query;
    this.serverName = name;
    this.assetURL = assetUrl;
    port = Number(port);
    // port += 1;
    this.item = new WebSocket(`ws://${ip}:${port}`);

    let self = this;
    this.item.onopen = function () {
      self.item.send("HI#582d5c62d44e51c0d145466ccfe396a9#%");
      self.item.send("ID#webAO#webAO#%");
      self.item.send("RC#%");
      self.item.send("RM#%");
      self.item.send("RD#%");
    };
    this.item.onmessage = function (event) {
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
        self.item.send(`CH#${self.charID}#%`);
      }
    };
  },
  computed: {
    areas: function () {
      if (!this.musicAndAreas) {
        return [];
      }
      const startMusicHeader = this.musicAndAreas.filter((item) =>
        item.includes("=")
      );
      if (startMusicHeader) {
        const copy = this.musicAndAreas.map((item) => String(item));
        const index = copy.indexOf(startMusicHeader[0]);
        return this.musicAndAreas.slice(0, index);
      }
      return [];
    },
    music: function () {
      if (!this.musicAndAreas) {
        return [];
      }
      const startMusicHeader = this.musicAndAreas.filter((item) =>
        item.includes("=")
      );
      if (startMusicHeader) {
        const copy = this.musicAndAreas.map((item) => String(item));
        const index = copy.indexOf(startMusicHeader[0]);
        return this.musicAndAreas.slice(index);
      }
      return [];
    },
  },
};
</script>

<style>
#icMessages {
  width: 200px;
  height: 200px;
  overflow-x: scroll;
  background-color: lightblue;
}
</style>