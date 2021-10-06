import RestCollection from 'ampersand-rest-collection';
import ProjectModel from './project_model';
import config from '../api/config';
import sync from '../api/api_sync';

const ProjectCollection = RestCollection.extend({
  model: ProjectModel,

  comparator: 'name',

  url() {
    return config.api.host + '/api/v6-rc1/' + this.parent.id + '/plans';
  },

  sync,
});

export default ProjectCollection;
