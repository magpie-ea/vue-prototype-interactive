<template>
  <Screen title="Welcome to the interactive experiment">
    <template #0>
      Welcome to the interactive experiment
    </template>
  </Screen>
</template>

<script>
import Screen from './Screen';

export default {
  name: 'InteractiveWelcome',
  components: { Screen },
  inject: ['nextScreen'],
  watch: {
    '$store.state.interactiveExperiment.experimentAvailable': function(value) {
      if (value === true) {
        this.nextScreen();
      }
    }
  },
  mounted() {
    this.$store.dispatch('interactiveExperiment/initializeExperiment');
  }
};
</script>
