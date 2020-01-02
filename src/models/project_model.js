import Model from 'ampersand-model';
import sync from '../api/api_sync';
import SegmentCollection from './segment_collection';

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    color_id: 'number',
    archived: ['boolean', true, false],
  },

  collections: {
    segments: SegmentCollection,
  },

  sync,
});

export default ProjectModel;
