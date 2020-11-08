<template>
  <div>
    Welcome to the interactive experiment
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'InteractiveWelcome',
  watch: {
    '$store.state.interactiveExperiment.experimentAvailable': function(value) {
      if (value === true) {
        this.$router.push({
          name: 'lobby'
        });
      }
    }
  },
  created() {
    this.initializeExperiment();
  },
  methods: {
    ...mapActions('interactiveExperiment', ['initializeExperiment'])
  }
};
</script>
