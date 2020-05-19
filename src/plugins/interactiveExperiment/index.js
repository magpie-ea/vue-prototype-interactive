import { Socket } from 'phoenix';
// import store from '../../store-interactive-experiment';

export default function install(Vue, { socketURL, experimentID }) {
  const interactiveExperiment = {
    /* Fields */
    experimentSocket: null,
    participantChannel: null,
    gameChannel: null,
    variant: null,
    chain: null,
    realization: null,
    participantId: null,
    experimentAvailable: false,
    /* Helper functions */
    showErrorMessageOnSocketError(reasons) {
      window.alert(
        `Sorry, a connection to our server couldn't be established. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. Error: ${JSON.stringify(
          reasons
        )}`
      );
    },
    showErrorMessageOnSocketTimeout() {
      window.alert(
        `Sorry, the connection to our server timed out. You may want to wait and try again. If the error persists, do not proceed with the HIT. Thank you for your understanding. `
      );
    },
    /* Methods */
    initializeSocket(socketURL, experimentID) {
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

      this.participantID = generateId(40);

      this.experimentSocket = new Socket(socketURL, {
        params: {
          participant_id: this.participantID,
          experiment_id: experimentID
        }
      });
    },

    initializeExperiment() {
      this.experimentSocket.onError(() =>
        this.showErrorMessageOnSocketError(
          'The connection to the server was dropped.'
        )
      );

      // Establish connection with the server.
      this.experimentSocket.connect();

      // First join the participant channel belonging only to this participant.
      this.participantChannel = this.experimentSocket.channel(
        `participant:${this.participantID}`,
        {}
      );

      this.participantChannel.on('experiment_available', payload => {
        this.variant = payload.variant;
        this.chain = payload.chain;
        this.realization = payload.realization;
        this.experimentAvailable = true;
      });

      this.participantChannel
        .join()
        // Note that `receive` functions are for receiving a *reply* from the server after you try to send it something, e.g. `join()` or `push()`.
        // While `on` function is for passively listening for new messages initiated by the server.
        // We still need to wait for the actual confirmation message of "experiment_available". So we do nothing here.
        .receive('ok', () => {})
        .receive('error', reasons => {
          this.showErrorMessageOnSocketError(reasons);
        })
        .receive('timeout', () => {
          this.showErrorMessageOnSocketTimeout();
        });
    }
  };

  interactiveExperiment.initializeSocket(socketURL, experimentID);
  interactiveExperiment.initializeExperiment();

  // $interactiveExperiment will be accessible in all Vue instances and all components.
  Object.defineProperty(Vue.prototype, '$interactiveExperiment', {
    get() {
      return interactiveExperiment;
    }
  });
}
