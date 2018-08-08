const Model = require('ampersand-model');
const sync = require('../api/api_sync');
const Collection = require('ampersand-rest-collection');

const Segment = Model.extend({
  sync,

  extraProperties: 'allow',

  props: {
    position: 'number',
    name: 'string'
  }
});

const Segments = Collection.extend({
  model: Segment,

  sync,

  comparator: 'position'
});

module.exports = Segments;
