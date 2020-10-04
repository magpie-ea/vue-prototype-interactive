import { Socket } from 'phoenix';

export const namespaced = true;

export const state = {
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
  waitingInLobby: false
};

export const mutations = {
  initializeSocket(state, { socketURL, experimentID }) {
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
  initializeExperiment(state) {
    // Establish connection with the server.
    state.experimentSocket.connect();

    // First join the participant channel belonging only to state participant.
    state.participantChannel = state.experimentSocket.channel(
      `participant:${state.participantID}`,
      {}
    );
  },
  setExperimentSocket(state, experimentSocket) {
    state.interactiveExperiment.experimentSocket = experimentSocket;
  },
  setParticipantChannel(state, participantChannel) {
    state.interactiveExperiment.participantChannel = participantChannel;
  },
  onExperimentAvailable(state, payload) {
    state.variant = payload.variant;
    state.chain = payload.chain;
    state.realization = payload.realization;
    state.experimentAvailable = true;
  },
  setGameChannel(state, gameChannel) {
    state.interactiveExperiment['gameChannel'] = gameChannel;
  },
  setInteractiveExperimentTuple(state, { variant, chain, realization }) {
    state.variant = variant;
    state.chain = chain;
    state.realization = realization;
  }
};

export const actions = {
  // initializeSocket({ commit }, { socketURL, experimentID }) {
  // },
  initializeExperiment({ commit, rootState, state }) {
    const socketURL = rootState.config.socketURL;
    const experimentID = rootState.config.experimentID;
    commit('initializeSocket', { socketURL, experimentID });
    commit('initializeExperiment');
    state.participantChannel.on('experiment_available', payload => {
      console.log('asdf');
      commit('onExperimentAvailable', payload);
    });

    console.log('qwer');

    state.participantChannel
      .join()
      // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
      // While `on` function is for passively listening for new messages initiated by the server.
      // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
      .receive('ok', () => {
        window.alert('asdfasdf');
      })
      .receive('error', reasons => {
        showErrorMessageOnSocketError(reasons);
      })
      .receive('timeout', () => {
        showErrorMessageOnSocketTimeout();
      });
  },
  // storeInteractiveExpMetaInfo({ commit }, { variant, chain, realization }) {},
  setGameChannel({ commit }, { gameChannel }) {
    commit('setGameChannel', gameChannel);
  }
};

export const getters = {
  interactiveExperiment: function(state) {
    return state.interactiveExperiment;
  },
  experimentSocket: function(state) {
    return state.experimentSocket;
  },
  participantChannel: function(state) {
    return state.participantChannel;
  }
};

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
