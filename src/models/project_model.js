const Model = require('ampersand-model');
const sync = require('../api/api_sync');
const SegmentCollection = require('./segment_collection');

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    color: 'number'
  },

  collections: {
    segments: SegmentCollection
  },

  sync
});

module.exports = ProjectModel;
