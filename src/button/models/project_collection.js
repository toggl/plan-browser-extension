var RestCollection = require('ampersand-rest-collection');
var ProjectModel = require('./project_model');
var sync = require('../api/sync');

var ProjectCollection = RestCollection.extend({

  model: ProjectModel,

  url: function() {
    return 'https://teamweek.com/api/v3/' + this.parent.id + '/projects';
  },

  sync: sync

});

module.exports = ProjectCollection;
