export const namespaced = true;

export const state = {
  // Config related
  variant: null,
  chain: null,
  realization: null,
  participantID: null,
  // Fields to be watched by components
  experimentAvailable: false,
  waitingInLobby: false,
  gameStarted: false,
  gameFinished: false,
  newMessageUpdate: null,
  initializeGameUpdate: null,
  nextRoundUpdate: null,
  endGameUpdate: null
};

export const mutations = {
  // INITIALIZE_SOCKET(state, { socketURL, experimentID }) {
  // },
  // INITIALIZE_EXPERIMENT(state, { socketURL, experimentID }) {
  //   state.experimentSocket = new Socket(socketURL, {
  //     params: {
  //       participant_id: state.participantID,
  //       experiment_id: experimentID
  //     }
  //   });

  //   state.experimentSocket.onError(() =>
  //     showErrorMessageOnSocketError('The connection to the server was dropped.')
  //   );

  //   // Establish connection with the server.
  //   state.experimentSocket.connect();

  //   // First join the participant channel belonging only to state participant.
  //   state.participantChannel = state.experimentSocket.channel(
  //     `participant:${state.participantID}`,
  //     {}
  //   );

  //   state.participantChannel.on('experiment_available', payload => {
  //     // Need to use a commit to perform a mutation since we're modifying the state
  //     this.commit('interactiveExperiment/ON_EXPERIMENT_AVAILABLE', payload);
  //     // state.variant = payload.variant;
  //     // state.chain = payload.chain;
  //     // state.realization = payload.realization;
  //     // state.experimentAvailable = true;
  //   });

  //   state.participantChannel
  //     .join()
  //     // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
  //     // While `on` function is for passively listening for new messages initiated by the server.
  //     // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
  //     .receive('ok', () => {})
  //     .receive('error', reasons => {
  //       showErrorMessageOnSocketError(reasons);
  //     })
  //     .receive('timeout', () => {
  //       showErrorMessageOnSocketTimeout();
  //     });
  // },
  ON_EXPERIMENT_AVAILABLE(state, payload) {
    state.variant = payload.variant;
    state.chain = payload.chain;
    state.realization = payload.realization;
    state.experimentAvailable = true;
  },
  INITIALIZE_GAME_CHANNEL(state) {
    state.gameChannel = state.experimentSocket.channel(
      `interactive_room:${state.experimentID}:${state.chain}:${state.realization}`,
      { participant_id: state.participantID }
    );
  },
  SET_EXPERIMENT_AVAILABLE(state) {
    state.experimentAvailable = true;
  },
  SET_WAITING_IN_LOBBY(state) {
    state.waitingInLobby = true;
  },
  SET_GAME_START(state) {
    state.gameStarted = true;
  },
  BROADCAST_EVENT_TO_CHANNEL(state, { event, payload }) {
    state.gameChannel.push(event, payload);
  },
  SET_INITIALIZE_GAME_UPDATE(state, payload) {
    state.initializeGameUpdate = payload;
  },
  SET_NEW_MESSAGE_UPDATE(state, payload) {
    state.newMessageUpdate = payload;
  },
  SET_NEXT_ROUND_UPDATE(state, payload) {
    state.nextRoundUpdate = payload;
  },
  SET_END_GAME_UPDATE(state, payload) {
    state.endGameUpdate = payload;
  }
};

export const actions = {
  initializeExperiment({ commit, rootState }) {
    const socketURL = rootState.config.socketURL;
    const experimentID = rootState.config.experimentID;
    // commit('INITIALIZE_SOCKET', { socketURL, experimentID });
    commit('INITIALIZE_EXPERIMENT', { socketURL, experimentID });
    // commit('INITIALIZE_EXPERIMENT');
  },
  joinLobby({ commit, state }) {
    commit('INITIALIZE_GAME_CHANNEL');

    state.gameChannel
      .join()
      .receive('ok', () => {
        commit('SET_WAITING_IN_LOBBY');
      })
      .receive('error', reasons => {
        showErrorMessageOnSocketError(reasons);
      })
      .receive('timeout', () => {
        showErrorMessageOnSocketTimeout();
      });

    state.gameChannel.on('start_game', () => {
      commit('SET_GAME_START');
    });
  },
  broadcastInitializeGameEvent({ commit }, payload) {
    commit('BROADCAST_EVENT_TO_CHANNEL', { event: 'initialize_game', payload });
  },
  broadcastNewMessageEvent({ commit }, payload) {
    commit('BROADCAST_EVENT_TO_CHANNEL', { event: 'new_msg', payload });
  },
  broadcastNextRoundEvent({ commit }, payload) {
    commit('BROADCAST_EVENT_TO_CHANNEL', { event: 'next_round', payload });
  },
  broadcastEndGameEvent({ commit }, payload) {
    commit('BROADCAST_EVENT_TO_CHANNEL', { event: 'end_game', payload });
  },
  subscribeToUpdate({ commit }, message) {
    state.gameChannel.on(message, payload => {
      commit('SET_UPDATE', payload);
    });
  },
  setUpSubscriptionsToUpdates({ commit }) {
    state.gameChannel.on('initialize_game', payload => {
      commit('SET_INITIALIZE_GAME_UPDATE', payload);
    });
    state.gameChannel.on('new_msg', payload => {
      commit('SET_NEW_MESSAGE_UPDATE', payload);
    });
    state.gameChannel.on('next_round', payload => {
      commit('SET_NEXT_ROUND_UPDATE', payload);
    });
    state.gameChannel.on('end_game', payload => {
      commit('SET_END_GAME_UPDATE', payload);
    });
  }
  // storeInteractiveExpMetaInfo({ commit }, { variant, chain, realization }) {},
};

export const getters = {};

/* Helper functions */
const showErrorMessageOnSocketError = function(reasons) {
  window.alert(
    `Sorry, a connection to our server couldn't be established. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. Error: ${JSON.stringify(
      reasons
    )}`
  );
};

const showErrorMessageOnSocketTimeout = function() {
  window.alert(
    `Sorry, the connection to our server timed out. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. `
  );
};
