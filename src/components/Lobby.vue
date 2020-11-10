<template>
  <h1>
    Connecting to the Server...
  </h1>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'Lobby',
  watch: {
    '$store.state.interactiveExperiment.waitingInLobby': function(value) {
      if (value === true) {
        this.title =
          'Successfully joined the lobby. Waiting for other participants...';
      }
    },
    '$store.state.interactiveExperiment.gameStarted': function(value) {
      if (value === true) {
        this.$router.push({
          name: 'color-reference'
        });
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
