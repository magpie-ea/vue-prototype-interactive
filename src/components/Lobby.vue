<template>
  <Screen :title="title"> </Screen>
</template>

<script>
import Screen from './Screen';
import { joinLobby } from '@/socket.js';

export default {
  name: 'Lobby',
  components: { Screen },
  inject: ['nextScreen', 'addResult'],
  data() {
    return {
      title: 'Connecting to the Server...'
    };
  },
  watch: {
    '$store.state.interactiveExperiment.waitingInLobby': function(value) {
      if (value === true) {
        this.title =
          'Successfully joined the lobby. Waiting for other participants...';
      }
    },
    '$store.state.interactiveExperiment.gameStarted': function(value) {
      if (value === true) {
        this.nextScreen();
      }
    }
  },
  mounted() {
    joinLobby();
  },
  methods: {}
};
</script>

<style scoped></style>
