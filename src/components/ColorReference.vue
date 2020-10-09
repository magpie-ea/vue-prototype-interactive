<template>
  <Screen :title="title">
    <template #0="{ nextSlide }">
      <!-- @slot provide a preparation stimulus, i.e. a text or an audio explanation-->
      <div class="magpie-view">
        <section class="magpie-text-container">
          <p id="game-instructions" class="magpie-view-text"></p>
        </section>
        <br />
        <br />
        <div id="chat-box"></div>

        <div class="magpie-view-answer-container">
          <textarea
            cols="50"
            class="magpie-response-text"
            placeholder="Type your message to the other participant here."
            id="participant-msg"
          ></textarea>
          <button
            class="magpie-view-button"
            @click.stop="broadcastNewMessageEvent({ message: 'test' })"
          >
            Send
          </button>
        </div>

        <div class="color-container magpie-view-stimulus-container">
          <div class="color-div color-div-1"></div>
          <div class="color-div color-div-2"></div>
          <div class="color-div color-div-3"></div>
        </div>
      </div>
      <slot name="prep" :done="nextSlide"> </slot>
    </template>
  </Screen>
</template>

<script>
import colorReferenceUtils from '../colorReferenceUtils';
import Screen from './Screen';
import { mapActions } from 'vuex';

export default {
  name: 'ColorReference',
  components: { Screen },
  inject: ['nextScreen', 'addResult'],
  data() {
    return {
      title: 'Color Reference Game'
    };
  },
  watch: {
    '$store.state.interactiveExperiment.newMessageUpdate': function(
      newMessage
    ) {
      this.title = newMessage.message;
    }
  },
  mounted() {
    this.setUpSubscriptionsToUpdates();
  },
  methods: {
    fillColor: function(div, color, type) {
      div.classList.remove(['target', 'distractor1', 'distractor2']);

      div.classList.add(type);

      if (
        type == 'target' &&
        this.$store.state.interactiveExperiment.variant == 1
      ) {
        div.classList.add('speaker-target');
      }

      div.style['background-color'] = colorReferenceUtils.produceColorStyle(
        color
      );

      div.dataset.type = type;
    },
    ...mapActions('interactiveExperiment', [
      'broadcastInitializeGameEvent',
      'broadcastNewMessageEvent',
      'broadcastNextRoundEvent',
      'broadcastEndGameEvent',
      'setUpSubscriptionsToUpdates'
    ])
  }
};
</script>

<style scoped></style>
