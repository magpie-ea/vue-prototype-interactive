import { Socket } from 'phoenix';
import store from './store/index';
import config from './config';

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

let variant = null;
let chain = null;
let realization = null;
let participantChannel = null;
// let gameChannel = null;
const socketURL = config.socketURL;
// const socketURL = 'ws://localhost:4000/socket';
const participantID = generateId(40);
const experimentID = config.experimentID;
// const experimentID = '2';
const experimentSocket = new Socket(socketURL, {
  params: {
    participant_id: participantID,
    experiment_id: experimentID
  }
});
experimentSocket.onError(() =>
  showErrorMessageOnSocketError('The connection to the server was dropped.')
);

export function initializeExperiment() {
  experimentSocket.connect();
  participantChannel = experimentSocket.channel(
    `participant:${participantID}`,
    {}
  );

  participantChannel.on('experiment_available', payload => {
    // Need to use a commit to perform a mutation since we're modifying the state
    variant = payload.variant;
    chain = payload.chain;
    realization = payload.realization;
    console.log(variant);
    console.log(chain);
    console.log(realization);
    store.commit('interactiveExperiment/SET_EXPERIMENT_AVAILABLE', null, {
      root: true
    });
  });

  participantChannel
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
}
