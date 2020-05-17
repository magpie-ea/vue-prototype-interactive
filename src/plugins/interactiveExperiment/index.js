import { Socket } from 'phoenix';
import store from '../../store';

// Lexical scoping is clearly at play here. Eh. No problem at all huh.

const initializeSocket = function(socketURL, experimentID) {
  /* For generating random participant IDs */
  // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
  // dec2hex :: Integer -> String
  const dec2hex = function(dec) {
    return ('0' + dec.toString(16)).substr(-2);
  };
  // generateId :: Integer -> String
  const generateId = function(len) {
    var arr = new Uint8Array((len || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('');
  };

  const participantID = generateId(40);

  return new Socket(socketURL, {
    params: { participant_id: participantID, experiment_id: experimentID }
  });
};

const initializeExperiment = function(Vue, experimentSocket) {
  // Helper functions
  const showErrorMessageOnSocketError = function(reasons) {
    window.alert(
      `Sorry, a connection to our server couldn't be established. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. Error: ${reasons}`
    );
  };

  const showErrorMessageOnSocketTimeout = function() {
    window.alert(
      `Sorry, the connection to our server timed out. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. `
    );
  };

  experimentSocket.onError(() =>
    showErrorMessageOnSocketError('The connection to the server was dropped.')
  );

  // Establish connection with the server.
  experimentSocket.connect();

  // First join the participant channel belonging only to this participant.
  const participantChannel = experimentSocket.channel(
    `participant:${magpie.participant_id}`,
    {}
  );

  participantChannel
    .join()
    // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
    // While `on` function is for passively listening for new messages initiated by the server.
    // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
    .receive('ok', _payload => {})
    .receive('error', reasons => {
      showErrorMessageOnSocketError(reasons);
    })
    .receive('timeout', () => {
      showErrorMessageOnSocketTimeout();
    });

  // This is the callback that we'll have to add later somewhere I think.
  // participantChannel.on('experiment_available', payload => {
  //   // Use Vuex later
  //   Vue.experimentInfo.variant = payload.variant;
  //   Vue.experimentInfo.chain = payload.chain;
  //   Vue.experimentInfo.realization = payload.realization;
  //   Vue.experimentInfo.socketConnectionEstablished = true;
  // });

  // Not really useful. This will only be invoked when the connection is explicitly closed by either the server or the client.
  // experimentSocket.onClose( () => console.log("Connection closed"));
};

export default function install(Vue, { socketURL, experimentID }) {
  const experimentSocket = initializeSocket(socketURL, experimentID);
  initializeExperiment(Vue, experimentSocket);

  // In the end, export the experimentSocket as a global object.
  Vue.experimentSocket = experimentSocket;
}
