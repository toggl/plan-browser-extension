import View from 'ampersand-view';
import template from './workspace_item.dot';
import css from './workspace_item.module.scss';

const WorkspaceItem = View.extend({
  template,
  css,

  props: {
    model: 'state',
    parent: 'state',
  },

  derived: {
    active: {
      deps: ['parent.selectedAccountId', 'model.id'],
      fn() {
        return this.parent.selectedAccountId === this.model.id;
      },
    },
  },

  bindings: {
    active: [
      {
        type: 'toggle',
        hook: 'active-icon',
      },
      {
        type: 'booleanClass',
        name: css.active,
      },
    ],
  },
});

export default WorkspaceItem;
