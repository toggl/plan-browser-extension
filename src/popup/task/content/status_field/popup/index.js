import View from 'ampersand-view';
import hub from 'src/popup/utils/hub';

import { boards } from 'core/session/stores/board/boards_store';
import { tasks } from 'core/session/stores/task/tasks_store';
import { createDOMNode as c } from 'core/utils/create_dom_node';
import { getEmoji } from 'modules/emoji_picker/src/data/emoji';

import css from './style.module.scss';
import template from './template.dot';

function truthy(val) {
  return val !== null && val !== undefined;
}

export default View.extend({
  template,
  css,

  props: {
    parent: ['object', true],
    task: ['state', true],
  },

  bindings: {
    'parent.task.fullStatusLabel': {
      type: 'text',
      hook: 'status-label',
    },
    'parent.task.statusArray': {
      type(el, statusArray) {
        const selectItems = statusArray.map(([value, label, icon]) =>
          c(
            'div',
            {
              className: `${css.tag} p:flex p:items-center p:cursor-pointer`,
              'data-value': value,
              'data-hook': 'status-select-item',
            },
            [getEmoji(icon), label].join(' ')
          )
        );
        selectItems.forEach(selectItem => el.appendChild(selectItem));
      },
      hook: 'statuses',
    },
  },

  events: {
    'click [data-hook=status-select-item]': 'setStatus',
  },

  close() {
    this.trigger('close');
  },

  setStatus(evt) {
    evt.preventDefault();

    // set status or plan_status_id?
    if (this.task.computedProject?.statuses === undefined) {
      // use status field
      const prevStatus = this.task.status;
      this.parent.parent.saveTask({
        status: evt.delegateTarget.dataset.value,
      });
      if (prevStatus !== this.task.status) {
        hub.trigger('achievements:track', 'tasks_done', {
          waitForModals: false,
        });
      }
    } else {
      const prevStatusId = this.task.plan_status_id;
      const newStatusId = parseInt(evt.delegateTarget.dataset.value);
      this.parent.parent.saveTask({
        status: null,
        plan_status_id: newStatusId,
      });
      if (prevStatusId !== newStatusId) {
        hub.trigger('achievements:track', 'tasks_done', {
          waitForModals: false,
        });
      }
      // update board if it is enabled
      if (this.task.computedProject?.board_enabled) {
        const board = boards.get(this.task.project_id);
        const lOrigin = board.getStatus(prevStatusId);
        const lTarget = board.getStatus(newStatusId);
        if (lOrigin === lTarget) {
          this.close();
          return;
        }
        const taskLocalId = tasks.getWhereRemoteId(this.task.id)?.current
          ._localId;
        if (truthy(taskLocalId)) {
          lTarget?.tasks.move([taskLocalId], 0);
          lOrigin?.tasks.remove([taskLocalId]);
        }
      }
    }
    this.close();
  },
});
