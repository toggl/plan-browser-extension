const Model = require('ampersand-model');
const sync = require('../api/api_sync');

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    color_id: 'number',
  },

  sync
});

module.exports = ProjectModel;
