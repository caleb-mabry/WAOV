<template>
  <h1>{{ serverName }}</h1>
  <h3>
    You are currently in <b>{{ currentArea.name }}</b>
  </h3>
  <div id="characterSelectModal" v-if="characterSelect">
    <div id="modalWrapper">
      <div id="modal">
        <span
          v-for="(character) in getCharacterIconUrls()"
          :key="character.name"
          @click="characterSelect = false; selectCharacter(character)"
          id="characterSelectionIcon"
        >
          <img :src="character.url" alt="" srcset="" />
          <!-- <font-awesome-icon :icon="['far', 'square']" />       -->
          <!-- {{character}} -->
        </span>
      </div>
    </div>
  </div>
  <div id="parent" style="display: flex; flex-direction: column">
    <div id="top">
      <div style="position: relative; width: 256px; height: 192px">
        <div style="position: absolute; width: 100%">
          <img :src="getBackgroundUrl()" />
        </div>
        <div style="position: absolute; width: 100%">
          <img :src="talkingCharacterUrl()" />
        </div>
        <div style="position: absolute; bottom: 0px; background-color: blue">
          {{ currentMessage }}
        </div>
      </div>
      <div id="icMessage">
        <input
          type="text"
          name="icMessage"
          id="icMessage_input"
          placeholder="Say something..."
          v-model="yourMessage"
        />
      </div>
    </div>
    <div id="icMessages">
      <p class="icMessage" v-for="(packet, index) in icMessages" :key="index">
        {{ packet.character }}:
        {{ packet.message }}
      </p>
    </div>
    <div id="backgroundSelect">
      <label for="backgrounds">Background</label>
      <br />
      <select id="backgrounds" v-model="currentBackground">
        <option v-for="background in backgrounds" :key="background">
          {{ background }}
        </option>
      </select>
    </div>
    <div id="bottom">
      <div id="yourCharacter" @click="characterSelect = true">
        <img
          :src="selectedCharacter.url"
          alt=""
          id="characterIcon"
          style="margin: 5px"
        />
        <div id="characterNamePosition">
          {{ selectedCharacter.name }}
        </div>
      </div>
      <div class="verticalBar"></div>
      <div id="areaInfo">Area: <br />{{ currentArea.name }}</div>
      <div class="verticalBar"></div>
    </div>
  </div>
</template>

<script lang="ts">
// import { library } from "@fortawesome/fontawesome-svg-core";
// import { faSquare } from '@fortawesome/free-regular-svg-icons'

// library.add(faSquare)

import { defineComponent } from "vue";
// import MusicDisplay from "../components/musicDisplay";
import Backgrounds from "../const/backgrounds";
import MsPacket from "../types/msPacket";

import msParser from "../network/ms_parse";
import scParser from "../network/sc_parse";
import charsCheckParser from "../network/chars_check";
import smParser from "../network/sm_parse";

interface Character {
  name: String;
  url: String;
}
interface Area {
  id: Number;
  name: String
}
const ServerConnect = defineComponent({
  // components: { MusicDisplay },
  data() {
    return {
      characterSelect: true,
      hardwareID: "TESTING-HARDWARE-ID",
      yourMessage: "",
      serverName: "",
      assetURL: "",
      characters: [] as Array<String>,
      musicAndAreas: [] as Array<String>,
      characterStatus: [] as Array<String>,
      icMessages: [] as Array<MsPacket>,
      charId: -1,
      socket: this.connect(),
      currentBackground: "",
      currentMessage: "",
      currentArea: {} as Area,
      backgrounds: Backgrounds,
      selectedCharacter: {} as Character,
      talkingCharacterEndUrl: "",
    };
  },
  mounted() {
    this.serverName = String(this.$route.query.name);
    this.assetURL = String(this.$route.query.assetUrl);
    let self = this;
    this.socket.onopen = function () {
      self.socket.send(`HI#${this.hardwareID}#%`);
      self.socket.send("ID#webAO#webAO#%");
      self.socket.send("RC#%");
      self.socket.send("RM#%");
      self.socket.send("RD#%");
    };

    this.socket.onmessage = function (event: { data: string }) {
      const packet = event.data;
      console.log(packet)
      if (packet.startsWith("MS")) {
        const msParsed = msParser(packet);
        self.icMessages.push(msParsed);
        self.currentMessage = msParsed.message;
        const emote = msParsed.emote.toLowerCase();
        const character = msParsed.character.toLowerCase();
        const messageContainer = document.querySelector("#icMessages");
        if (messageContainer) {
          messageContainer.scrollTop = messageContainer.scrollHeight;
        }
        self.talkingCharacterEndUrl = `${character}/(a)${emote}.apng`;
      } else if (packet.startsWith("SC")) {
        self.characters = scParser(packet);
      } else if (packet.startsWith("CharsCheck")) {
        self.characterStatus = charsCheckParser(packet);
      } else if (packet.startsWith("ASS")) {
        self.assetURL = packet.split("#")[1];
      } else if (packet.startsWith("SM")) {
        const smParsed = smParser(packet);
        self.musicAndAreas = smParsed;
        self.currentArea = self.createArea(0, smParsed[0]);
      } else if (packet.startsWith("CHECK")) {
        self.socket.send(`CH#${self.charId}#%`);
      } else if (packet.startsWith("BN")) {
        self.currentBackground = packet.split("#")[1];
      }
    };
  },

  methods: {
    createArea(id: Number, name: String): Area {
      return {
        id: id,
        name: name
      }
    },
    selectCharacter(character: Character) {
      const charID = this.characters.indexOf(character.name)
      this.socket.send(`CC#${this.currentArea.id}#${charID}#${this.hardwareID}#%`)
      this.selectedCharacter = character
      // console.error(`CC#${this.currentcharactersArea}#${charID}#${this.hardwareID}#%`)
    },
    getCharacterIconUrls() {
      const availableCharacterNames = this.characterStatus.map((statusCode, index) => statusCode === '0' ? this.characters[index] : '')
      const availableCharacters = availableCharacterNames.filter(name => Boolean(name))
      return availableCharacters.map((character: String) => (
        {
        name: character,
        url: `${
          this.assetURL
        }characters/${character.toLowerCase()}/char_icon.png`,
      }));
    },
    getBackgroundUrl() {
      return `${
        this.assetURL
      }background/${this.currentBackground.toLowerCase()}/defenseempty.png`;
    },
    talkingCharacterUrl() {
      return `${this.assetURL}characters/${this.talkingCharacterEndUrl}`;
    },
    connect(): WebSocket {
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
      const startMusicHeader = this.musicAndAreas.filter((item) =>
        item.includes("=")
      );
      if (startMusicHeader) {
        const index = this.musicAndAreas.indexOf(startMusicHeader[0]);
        return this.musicAndAreas.slice(index);
      }
      return [];
    },
  },
});
export default ServerConnect;
</script>

<style scoped>
#characterSelectionIcon {
  padding: 5px;
}
#characterSelectionIcon:hover {
  opacity: 0.4;
}
#modalWrapper {
  display: table-cell;
  vertical-align: middle;
}

#modal {
  width: 50%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  font-family: Helvetica, Arial, sans-serif;
}
#characterSelectModal {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}
#characterDisplay {
  overflow: hidden;
  width: 256px;
  height: 192px;
}
#characterNamePosition {
  font-weight: bold;
  color: #425aa2;
  display: flex;
  align-items: center;
  justify-content: center;
}
#yourCharacter {
  display: flex;
  padding: 2%;
  align-items: center;
}
#yourCharacter:hover {
  opacity: 0.5;
  cursor: pointer;
}
#characterIcon {
  width: 60px;
  height: 60px;
  margin: 5px;
  border: 3px solid black;
  border-radius: 5%;
}
#areaInfo {
  display: flex;
  align-items: center;
  padding: 2%;
}
.verticalBar {
  width: 5px;
  height: 50px;
  background-color: #c1d4eb;
}
#top {
  display: flex;
  flex-direction: column;
}
#backgroundSelect {
  border: 5px solid whitesmoke;
  padding: 5px;
}
.icMessage {
  padding: 0px;
  margin: 0px;
}
#icMessages {
  width: 400px;
  height: 200px;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  overflow-x: hidden;
  font-weight: bold;
  text-align: left;
  padding-left: 5px;
  background-color: #263444;
  color: #c1d4eb;
}
img {
  max-width: 100%;
}
#bottom {
  position: fixed;
  display: flex;
  align-items: center;
  bottom: 0px;
  padding: 10px;
  height: 100px;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  color: #000000;
}
</style>