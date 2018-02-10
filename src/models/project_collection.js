const RestCollection = require('ampersand-rest-collection');
const ProjectModel = require('./project_model');
const config = require('../api/config');
const sync = require('../api/api_sync');

const ProjectCollection = RestCollection.extend({
  model: ProjectModel,

  url() {
    return config.api.host + '/timeline/v1/' + this.parent.id + '/projects';
  },

  sync
});

module.exports = ProjectCollection;
