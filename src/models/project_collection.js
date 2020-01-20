import RestCollection from 'ampersand-rest-collection';
import ProjectModel from './project_model';
import config from '../api/config';
import sync from '../api/api_sync';

const ProjectCollection = RestCollection.extend({
  model: ProjectModel,

  comparator: 'name',

  url() {
    return config.api.host + '/api/v4/' + this.parent.id + '/projects';
  },

  sync,
});

export default ProjectCollection;
