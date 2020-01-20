import Model from 'ampersand-model';
import Collection from 'ampersand-collection';
import FilteredSubcollection from 'ampersand-filtered-subcollection';

export const Suggestion = Model.extend({
  props: {
    string: 'string',
    original: 'object',
    index: 'number',
  },
});

export const Suggestions = Collection.extend({
  model: Suggestion,
});

export const OtherMembers = FilteredSubcollection.extend({
  constructor(task, users) {
    FilteredSubcollection.call(this, users, {
      filter(user) {
        return user.active && !task.assigned(user);
      },
      comparator: 'name',
    });
    this.listenTo(users, 'change add remove sync', this._runFilters);
    this.listenTo(task, 'change:workspace_members', this._runFilters);
  },
});

export const TaskMembers = FilteredSubcollection.extend({
  constructor(task, users) {
    FilteredSubcollection.call(this, users, {
      filter(user) {
        return task.assigned(user);
      },
      comparator(user) {
        return task.workspace_members.indexOf(user.membership_id);
      },
    });
    this.listenTo(users, 'change add remove sync', this._runFilters);
    this.listenTo(task, 'change:workspace_members', this._runFilters);
  },
});
