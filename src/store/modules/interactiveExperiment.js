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
  // storeInteractiveExpMetaInfo({ commit }, { variant, chain, realization }) {},
};

export const getters = {};
