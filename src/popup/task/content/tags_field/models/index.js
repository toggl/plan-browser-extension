import Collection from 'ampersand-collection';
import FilteredSubcollection from 'ampersand-filtered-subcollection';

export const TagOptions = FilteredSubcollection.extend({
  constructor(workspace, task) {
    this.task = task;
    this.workspace = workspace;

    FilteredSubcollection.call(this, new Collection(), {
      where: {},
      comparator({ name }) {
        return name;
      },
    });

    this.updateCollection();
    this.setupFilters();
  },

  async setupFilters() {
    if (this.project) {
      await this.project.loadTags();

      const { tags } = this.project;

      this.collection = tags;

      this.listenTo(tags, 'sync add remove change', () => this._runFilters());
    }

    this.listenTo(this.task, 'change:plan_id', () => this.updateCollection());

    this._runFilters();
  },

  updateCollection() {
    const { plan_id: planId } = this.task;
    if (!planId) {
      this.stopListening(this.collection, 'sync add remove change');
      this.collection = new Collection();
    } else {
      this.project = this.workspace.projects.get(planId);
      this.setupFilters();
    }
  },
});
