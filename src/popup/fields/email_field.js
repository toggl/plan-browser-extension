var isEmail = require('is-email');
var TextField = require('./text_field');

var EmailField = TextField.extend({

  derived: {
    isEmail: {
      deps: ['value'],
      fn: function() {
        return isEmail(this.value);
      }
    }
  }

});

module.exports = EmailField;
