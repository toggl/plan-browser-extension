import '../global.less';
import './fuseboardapp.less';

import * as twb from '../../utils/content';

/* Projects/Deals/Tickets list items */
/* Project/Deal/Ticket task list items */
twb.observe(
  'ul#tasklists ul.tasks li, #deal-list tr .summary, #ticket-list tr .summary, #project-list tr',
  itemEl => {
    if (!itemEl) {
      return;
    }

    const titleEl = itemEl.querySelector('a');
    if (!titleEl) {
      return;
    }

    const title = titleEl.textContent.trim();

    const button = twb.create({
      task: { name: title },
      anchor: 'screen',
    });

    const containerEl = itemEl.querySelector('h6');
    if (!containerEl) {
      return;
    }

    twb.prepend(button, containerEl);

    return button;
  },
  button => {
    if (!button) {
      return;
    }
    twb.remove(button);
  }
);

/* Projects/Deals/Tickets board cards */
twb.observe(
  'ul.deals li, ul.projects li, ul.tickets li',
  itemEl => {
    if (!itemEl) {
      return;
    }

    const titleEl = itemEl.querySelector('.board-card-title');
    if (!titleEl) {
      return;
    }

    const title = titleEl.textContent.trim();

    const button = twb.create({
      task: { name: title },
      anchor: 'screen',
    });

    const containerEl = itemEl.querySelector('.board-snapshot-icons');
    if (!containerEl) {
      return;
    }

    twb.append(button, containerEl);

    return button;
  },
  button => {
    if (!button) {
      return;
    }

    twb.remove(button);
  }
);
