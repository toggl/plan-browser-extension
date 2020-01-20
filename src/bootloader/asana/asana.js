import domify from 'domify';
import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import * as observer from 'src/utils/observer';
import { generateTaskNotes } from '../../utils/quill';
import '../global.less';
import './asana.less';

const buttons = new HashMap();

function createObserver() {
  observer
    .create('.Pane.PotListPage-detailsPane, .SingleTaskPane')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function createButton(element) {
  const state = new ButtonState({
    task: {
      notes: generateTaskNotes('Asana', location.href),
    },
    link: location.href,
    anchor: 'screen',
  });

  const titleObserver = observer
    .create(
      '.SingleTaskTitleRow-taskName textarea, .SingleTaskTitleInput textarea',
      element
    )
    .onAdded(function(titleEl) {
      state.task.name = titleEl.value;
      titleEl.addEventListener(
        'change',
        () => {
          state.task.name = titleEl.value;
        },
        false
      );
    })
    .start();

  const actionsObserver = observer
    .create(
      '.SingleTaskPaneToolbar, .SingleTaskPaneToolbarEasyCompletion',
      element
    )
    .onAdded(function(actionsEl) {
      const cls = document.querySelector('.SingleTaskPaneToolbarEasyCompletion')
        ? 'CircularButton CircularButton--enabled CircularButton--medium CircularButton--borderless  SingleTaskPaneToolbarEasyCompletion-button'
        : 'circularButtonView circularButtonView--default circularButtonView--onWhiteBackground circularButtonView--active SingleTaskPaneToolbar-button';
      const itemEl = domify(`<div class="${cls}"></div>`);
      const buttonEl = state.button.render().el;

      itemEl.appendChild(buttonEl);
      actionsEl.insertBefore(itemEl, actionsEl.children[2]);
    })
    .start();

  buttons.set(element, {
    state,
    title: titleObserver,
    actions: actionsObserver,
  });
}

function removeButton(node) {
  const button = buttons.get(node);

  if (button) {
    button.state.remove();
    button.title.stop();
    button.actions.stop();
  }
}

function handleError(error) {
  console.error(error);
}

if (!ButtonState.isLoaded()) {
  ButtonState.initialize()
    .then(createObserver)
    .catch(handleError);
}
