import { Socket } from 'phoenix';

export const namespaced = true;

export const state = {
  // Config related
  socketURL: null,
  experimentSocket: null,
  experimentID: null,
  participantChannel: null,
  gameChannel: null,
  variant: null,
  chain: null,
  realization: null,
  participantID: null,
  // Fields to be watched by components
  experimentAvailable: false,
  waitingInLobby: false,
  gameStarted: false,
  gameFinished: false
};

export const mutations = {
  INITIALIZE_SOCKET(state, { socketURL, experimentID }) {
    state.participantID = generateId(40);

    state.socketURL = socketURL;
    state.experimentID = experimentID;

    state.experimentSocket = new Socket(socketURL, {
      params: {
        participant_id: state.participantID,
        experiment_id: experimentID
      }
    });

    state.experimentSocket.onError(() =>
      showErrorMessageOnSocketError('The connection to the server was dropped.')
    );
  },
  INITIALIZE_EXPERIMENT(state) {
    // Establish connection with the server.
    state.experimentSocket.connect();

    // First join the participant channel belonging only to state participant.
    state.participantChannel = state.experimentSocket.channel(
      `participant:${state.participantID}`,
      {}
    );
  },
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
  SET_WAITING_IN_LOBBY(state) {
    state.waitingInLobby = true;
  },
  SET_GAME_START(state) {
    state.gameStarted = true;
  },
  SEND_MESSAGE_TO_CHANNEL(state, { message, payload }) {
    state.gameChannel.push(message, payload);
  }
};

export const actions = {
  initializeExperiment({ commit, rootState, state }) {
    const socketURL = rootState.config.socketURL;
    const experimentID = rootState.config.experimentID;
    commit('INITIALIZE_SOCKET', { socketURL, experimentID });
    commit('INITIALIZE_EXPERIMENT');
    state.participantChannel.on('experiment_available', payload => {
      // Need to use a commit to perform a mutation since we're modifying the state
      commit('ON_EXPERIMENT_AVAILABLE', payload);
    });

    state.participantChannel
      .join()
      // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
      // While `on` function is for passively listening for new messages initiated by the server.
      // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
      .receive('ok', () => {})
      .receive('error', reasons => {
        showErrorMessageOnSocketError(reasons);
      })
      .receive('timeout', () => {
        showErrorMessageOnSocketTimeout();
      });
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
  sendMessageToChannel({ commit }, { message, payload }) {
    commit('SEND_MESSAGE_TO_CHANNEL', { message, payload });
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

/* For generating random participant IDs */
// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
// generateId :: Integer -> String
const generateId = function(len) {
  // dec2hex :: Integer -> String
  const dec2hex = function(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  };

  let arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
};
