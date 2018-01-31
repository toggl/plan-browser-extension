const Model = require('ampersand-model');
const sync = require('../api/api_sync');

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string'
  },

  sync
});

module.exports = ProjectModel;
