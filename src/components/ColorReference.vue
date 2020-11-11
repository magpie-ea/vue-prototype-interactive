<template>
  <Screen :title="title">
    <template #0="{ nextSlide }">
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
          <button class="magpie-view-button" @click.stop="broadcastMsg()">
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
import {
  variant,
  broadcastInitializeGameEvent,
  broadcastNewMessageEvent,
  broadcastNextRoundEvent
  // broadcastEndGameEvent
} from '@/socket.js';

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
    '$store.state.interactiveExperiment.newMessagePayload': function(payload) {
      let chatBox = document.querySelector('#chat-box');
      let msgBlock = document.createElement('p');
      msgBlock.classList.add('magpie-view-text');
      msgBlock.insertAdjacentHTML('beforeend', `${payload.message}`);
      chatBox.appendChild(msgBlock);
    },
    '$store.state.interactiveExperiment.initializeGamePayload': function(
      payload
    ) {
      this.setUpOneRound(payload.colors);
    },
    '$store.state.interactiveExperiment.nextRoundPayload': function(payload) {
      this.setUpOneRound(payload.colors);
    }
  },
  mounted() {
    if (variant == 2) {
      broadcastInitializeGameEvent({
        colors: colorReferenceUtils.sampleColors()
      });
    }
  },
  methods: {
    broadcastMsg() {
      const msg = document.querySelector('#participant-msg').value;
      broadcastNewMessageEvent({ message: msg });
    },
    fillColor(div, color, type) {
      div.classList.remove(['target', 'distractor1', 'distractor2']);

      div.classList.add(type);

      if (type == 'target' && variant == 1) {
        div.classList.add('speaker-target');
      }

      div.style['background-color'] = colorReferenceUtils.produceColorStyle(
        color
      );

      div.dataset.type = type;
    },
    setUpOneRound(colors) {
      // Seems that we just have to store them globally somewhere.
      let indices = [0, 1, 2];
      colorReferenceUtils.shuffleArray(indices);

      let color_divs = document.getElementsByClassName('color-div');
      let count = 0;
      // var pos = {};
      for (let [type, color] of Object.entries(colors)) {
        this.fillColor(color_divs[indices[count]], color, type);
        // pos[type] = indices[count];
        count += 1;
      }

      // Only the listener can select a response apparently.
      if (variant == 2) {
        for (let div of color_divs) {
          div.onclick = () => {
            let selectedType = div.dataset.type;
            let selectedColor = div.style['background-color'];
            broadcastNewMessageEvent({
              message: 'type: ' + selectedType + ' color: ' + selectedColor
            });
            broadcastNextRoundEvent({
              colors: colorReferenceUtils.sampleColors()
            });
          };
        }
      }
    }
  }
};
</script>

<style scoped>
.color-div-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  text-align: center;
  flex-wrap: nowrap;
  margin: 0 auto;
}

.color-div {
  height: 150px;
  flex: 1;
  margin: 5px;
}

.speaker-target {
  border: 5px solid black;
}

.color-container {
  width: 400px;
}
</style>
