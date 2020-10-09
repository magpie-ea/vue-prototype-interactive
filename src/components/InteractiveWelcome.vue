<template>
  <Screen title="Welcome to the interactive experiment">
    <template #0>
      Welcome to the interactive experiment
    </template>
  </Screen>
</template>

<script>
import Screen from './Screen';
import { mapActions } from 'vuex';

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
    this.initializeExperiment();
  },
  methods: {
    ...mapActions('interactiveExperiment', ['initializeExperiment'])
  }
};
</script>
