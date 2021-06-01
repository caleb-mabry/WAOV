import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state () {
    return {
      serverList: [],
      selectedServer: {}
    }
  },
  getters: {
    getServerByName: (state) => (serverName) => {
        return state.serverList.filter(server => server.name === serverName)
    }
  },
  
  mutations: {
    setSelectedServer(state, value) {
        state.selectedServer = value
    },
    setServerList (state, value) {
      state.serverList = value
    }
  }
})

createApp(App).use(store).use(router).mount('#app')