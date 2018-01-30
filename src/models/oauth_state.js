const State = require('ampersand-state');

/**
 * State for storing OAuth client ID and secret
 */
const OAuthState = State.extend({
  props: {
    /** Client ID */
    id: 'string',
    /** Client secret */
    secret: 'string'
  },

  derived: {
    /** Base64'd combination of client ID and secret */
    token: {
      deps: ['id', 'secret'],
      fn() {
        return btoa(this.id + ':' + this.secret);
      }
    }
  }
});

module.exports = OAuthState;
