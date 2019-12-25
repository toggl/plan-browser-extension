import Model from 'ampersand-model';
import sync from '../api/api_sync';
import SegmentCollection from './segment_collection';

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    color: 'number',
  },

  collections: {
    segments: SegmentCollection,
  },

  sync,
});

export default ProjectModel;
