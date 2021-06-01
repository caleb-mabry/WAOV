<template>
  <h1>{{ serverName }}</h1>
  <div v-for="(character, index) in music" :key="index">
      <button @click="getMusic(character)">{{character}} </button>
  </div>
  <h2>{{assetURL}}</h2>
  <div>
    <h1>Current Messages</h1>
    <div v-for="(packet, index) in icMessages" :key="index">
      {{ packet.message }}
    </div>
  </div>
  <div>
    <h1>Available Characters</h1>
  <div v-for="(character, index) in characters" :key="index">
    <div v-if="characterStatus[index] != -1">
      {{character}} 
      </div>
  </div>
  </div>
</template>

<script>
import msParser from "../network/ms_parse.js";
import scParser from "../network/sc_parse.js";
import charsCheckParser from "../network/chars_check.js"
import smParser from "../network/sm_parse.js"

export default {
  name: "ServerConnect",
  data() {
    return {
      serverName: "",
      assetURL: "",
      characters: [],
      music: [],
      characterStatus: [],
      icMessages: [],
      audio: new Audio()
    };
  },
  methods: {
    getMusic: function(name) {
      if (!this.audio.ended) {
        this.audio.pause()
      }
      this.audio = new Audio(`${this.assetURL}sounds/music/${name.toLowerCase()}`)      
      this.audio.play()
    } 
  },
  mounted() {
    let { name, ip, port, assetUrl } = this.$route.query;
    this.serverName = name;
    this.assetURL = assetUrl
    port = Number(port);
    port += 1;
    this.item = new WebSocket(`ws://${ip}:${port}`);

    let self = this;
    let count = 0;
    this.item.onmessage = function (event) {
      const packet = event.data
      if (count === 0) {
        self.item.send("HI#582d5c62d44e51c0d145466ccfe396a9#%");
        self.item.send("ID#webAO#webAO#%");
        self.item.send('RC#%')
        self.item.send('RM#%')
        self.item.send('RD#%')

        count += 1;
      }
      if (packet.startsWith("MS")) {
        self.icMessages.push(msParser(packet));
      }
      else if(packet.startsWith("SC")) {
        self.characters = scParser(packet)
      }
      else if (packet.startsWith("CharsCheck")) {
        self.characterStatus = charsCheckParser(packet)
      }
      else if(packet.startsWith("ASS")) {
        self.assetURL = packet.split('#')[1]
      }
      else if(packet.startsWith('SM')) {
        self.music = smParser(packet)
      }
      console.log(packet)
        
    };
  },
};
</script>

<style>
.t {
  box-shadow: 
    12px 12px 16px 0 rgba(0, 0, 0, 0.25),
    -8px -8px 12px 0 rgba(255, 255, 255, 0.3);
      width: 200px;
  height: 200px;
  background-color: yellow;
}
</style>