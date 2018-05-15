const State = require('ampersand-state');
const Collection = require('ampersand-collection');

const Color = State.extend({
  props: {
    id: ['number', true],
    hex: ['string', true],
  },
});

module.exports = Collection.extend({
  model: Color,
});
