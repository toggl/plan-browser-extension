var State = require('ampersand-state');

var OAuthState = State.extend({

  props: {
    id: 'string',
    secret: 'string'
  },

  derived: {
    token: {
      deps: ['id', 'secret'],
      fn: function() {
        return btoa(this.id + ':' + this.secret);
      }
    }
  }

});

module.exports = OAuthState;
