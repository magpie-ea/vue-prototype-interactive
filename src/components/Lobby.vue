<template>
  <Screen :title="title"> </Screen>
</template>

<script>
import Screen from './Screen';

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
    }
  },
  mounted() {
    this.$store.dispatch('interactiveExperiment/joinLobby');
  }
};
</script>

<style scoped></style>
