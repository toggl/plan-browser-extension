var RestCollection = require('ampersand-rest-collection');
var ProjectModel = require('./project_model');
var config = require('../api/config');
var sync = require('../api/sync');

var ProjectCollection = RestCollection.extend({

  model: ProjectModel,

  url: function() {
    return config.api.host + '/api/v3/' + this.parent.id + '/projects';
  },

  sync: sync

});

module.exports = ProjectCollection;
