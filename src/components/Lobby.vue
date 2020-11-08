<template>
  <Screen :title="title"> </Screen>
</template>

<script>
import Screen from './Screen';
import { mapActions } from 'vuex';

export default {
  name: 'Lobby',
  components: { Screen },
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
        console.log('true');
      }
    }
  },
  created() {
    this.joinLobby();
  },
  methods: {
    ...mapActions('interactiveExperiment', [
      'joinLobby'
      // 'initializeExperiment'
    ])
  }
};
</script>

<style scoped></style>
