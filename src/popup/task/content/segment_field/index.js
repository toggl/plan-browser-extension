import Collection from 'ampersand-collection';
import FilteredSubcollection from 'ampersand-filtered-subcollection';
import IconView from './icon';
import SelectField from '../select_field';
import css from './style.module.scss';
import { createSegment } from 'src/popup/utils/helpers';

const SegmentsCollection = FilteredSubcollection.extend({
  constructor(view) {
    this.view = view;

    FilteredSubcollection.call(this, new Collection(), {
      where: {},
      comparator({ name }) {
        return name;
      },
    });

    this.updateCollection();
    this.segmentFilters();
  },

  segmentFilters() {
    if (this.project) {
      const { segments } = this.project;

      this.collection = segments;

      this.listenTo(segments, 'sync add remove change', () =>
        this._runFilters()
      );
    }

    this.listenTo(this.view.task, 'change:plan_id', () =>
      this.updateCollection()
    );

    this._runFilters();
  },

  updateCollection() {
    const { plan_id: planId } = this.view.task;
    if (!planId) {
      this.stopListening(this.collection, 'sync add remove change');
      this.collection = new Collection();
    } else {
      this.project = this.view.workspace.projects.get(planId);
      this.segmentFilters();
    }
  },
});

export default function(props) {
  const { parent } = props;
  const segments = new SegmentsCollection(parent);
  const field = new SelectField({
    ...props,
    tabIndex: 4,
    heading: 'Segment',
    headingIconClass: css.icon,
    getCollectionItems: () => segments.models,
    iconView: IconView,
    addButtonlabel: 'Add Segment',
    modelIdProp: 'timeline_segment_id',
    canRemove: false,
    async addModel(name) {
      const {
        task: { plan_id },
      } = props;
      if (!plan_id) {
        return;
      }
      const { workspace } = parent;
      const segment = await createSegment(
        {
          workspace,
          project: workspace.projects.findWhere({ id: plan_id }),
        },
        {
          name,
          plan_id,
        }
      );
      this.saveTask(segment);
    },
    async saveTask(segment) {
      parent.task.set({ timeline_segment_id: segment && segment.id });
    },
    parent,
  });

  return field;
}
