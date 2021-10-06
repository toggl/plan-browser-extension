import Collection from 'ampersand-collection';
import FilteredSubcollection from 'ampersand-filtered-subcollection';
import IconView from './icon';
import SelectField from '../select_field';
import css from './style.module.scss';
import { createStatus } from 'src/popup/utils/helpers';

const StatusesCollection = FilteredSubcollection.extend({
  constructor(view) {
    this.view = view;

    FilteredSubcollection.call(this, new Collection(), {
      where: {},
      comparator({ position }) {
        return position;
      },
    });

    this.updateCollection();
    this.statusFilters();
  },

  statusFilters() {
    if (this.project) {
      const { statuses } = this.project;

      this.collection = statuses;

      this.listenTo(statuses, 'sync add remove change', () =>
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
      this.statusFilters();
    }
  },
});

export default function(props) {
  const { parent } = props;
  const statuses = new StatusesCollection(parent);
  const field = new SelectField({
    ...props,
    tabIndex: 2,
    heading: 'Status',
    headingIconClass: css.icon,
    getCollectionItems: () => statuses.models,
    iconView: IconView,
    addButtonlabel: 'Add Status',
    modelIdProp: 'plan_status_id',
    canRemove: false,
    async addModel(name) {
      const {
        task: { plan_id },
      } = props;
      if (!plan_id) {
        return;
      }
      const { workspace } = parent;
      const status = await createStatus(
        {
          workspace,
          project: workspace.projects.findWhere({ id: plan_id }),
        },
        {
          name,
          plan_id,
        }
      );
      this.saveTask(status);
    },
    async saveTask(status) {
      parent.task.set({ plan_status_id: status && status.id });
    },
    parent,
  });

  return field;
}
