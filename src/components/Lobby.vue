<template>
  <Screen title="Connecting to the Server..."> </Screen>
</template>

<script>
import Screen from './Screen';
// import Vue from './Vue';
// import store from '../store';

export default {
  name: 'Lobby',
  components: { Screen },
  inject: ['nextScreen', 'addResult'],
  props: {},
  data() {
    return {};
  },
  methods: {},
  mounted() {}
};
</script>

<style scoped></style>
