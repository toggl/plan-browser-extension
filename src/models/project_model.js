import Model from 'ampersand-model';
import sync from '../api/api_sync';
import SegmentCollection from './segment_collection';
import StatusCollection from './status_collection';
import TagCollection from './tag_collection';

const ProjectModel = Model.extend({
  props: {
    id: 'number',
    name: 'string',
    color_id: 'number',
    archived: ['boolean', true, false],
  },

  collections: {
    segments: SegmentCollection,
    statuses: StatusCollection,
    tags: TagCollection,
  },

  sync,

  async loadTags() {
    if (this.loadTagsPromise) {
      await this.loadTagsPromise;
      return;
    }

    this.loadTagsPromise = this.tags.fetch();
    await this.loadTagsPromise;
  },
});

export default ProjectModel;
