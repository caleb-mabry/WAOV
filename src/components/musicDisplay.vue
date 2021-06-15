<template>
  <div v-for="folder in Object.keys(getFolderStructure)" :key="folder">
    <h3>{{folder}}</h3>
    <div v-for="song in getFolderStructure[folder]" :key="song">
      <button @click="getMusic(song)">{{ song }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "MusicDisplay",
  props: ["musicList", "assetURL"],
  data: function () {
    return {
      audio: new Audio(),
    };
  },
  unmounted() {
    this.audio.pause()
  },
  methods: {
    getMusic: function (name) {
      if (!this.audio.ended) {
        this.audio.pause();
      }
      this.audio = new Audio(
        `${this.assetURL}sounds/music/${name.toLowerCase()}`
      );
      this.audio.play();
    },
  },
  computed: {
    getFolderStructure: function() {
      let structure = {}
      let folder = ''
      for (let indx = 0; indx < this.musicList.length; indx++) {
        const currentValue = this.musicList[indx]
        if (currentValue.includes('=')) {
          folder = currentValue
          structure[folder] = []
        } else {
          structure[folder].push(currentValue)
        }
      }
      return structure

    }
  }
};
</script>