<template>
  <Screen title="Welcome to the interactive experiment"> </Screen>
</template>

<script>
import Screen from './Screen';

export default {
  name: 'InteractiveWelcome',
  components: { Screen },
  data() {
    return {
      socketConnectionEstablished: this.$interactiveExperiment
        .socketConnectionEstablished
    };
  },
  inject: ['nextScreen'],
  watch: {
    socketConnectionEstablished: function(value) {
      if (value === true) {
        this.nextScreen();
      }
    }
  }
};
</script>
