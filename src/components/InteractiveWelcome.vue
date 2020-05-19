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
  data() {
    return {
      experimentAvailable: this.$interactiveExperiment.experimentAvailable
    };
  },
  inject: ['nextScreen'],
  watch: {
    experimentAvailable: function(value) {
      if (value === true) {
        this.nextScreen();
      }
    }
  },
  mounted() {
    if (this.experimentAvailable) {
      this.nextScreen();
    }
  }
};
</script>
