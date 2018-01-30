const isEmail = require('is-email');
const TextField = require('./text_field');

const EmailField = TextField.extend({
  derived: {
    isEmail: {
      deps: ['value'],
      fn() {
        return isEmail(this.value);
      }
    }
  }
});

module.exports = EmailField;
