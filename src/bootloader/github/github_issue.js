import moment from 'moment';
import HashMap from 'hashmap';
import ButtonState from 'src/button/button';
import observer from 'src/utils/observer';
import { generateTaskNotes } from '../../utils/quill';

const buttons = new HashMap();

const DATE_RE = /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})/;

function createObserver() {
  observer
    .create('.milestone')
    .onAdded(createButton)
    .onRemoved(removeButton)
    .start();
}

function findDate(meta) {
  const matches = DATE_RE.exec(meta);
  if (!matches) {
    return;
  }

  const m = moment(matches[0], 'MMMM DD, YYYY');
  if (!m.isValid()) {
    return;
  }

  return m.toDate();
}

function createButton(element) {
  const titleEl = element.querySelector('.milestone-title-link');
  const metaEl = element.querySelector('.milestone-meta');
  const linkEl = titleEl.querySelector('a');

  const name = titleEl.querySelector('a').innerText;
  const date = findDate(metaEl.innerText);
  const link = linkEl.href;

  const state = new ButtonState({
    link,
    task: {
      name,
      end_date: date,
      notes: generateTaskNotes('GitHub', link),
    },
    anchor: 'element',
  });

  const buttonEl = state.button.render().el;
  titleEl.appendChild(buttonEl);

  buttons.set(element, state);
}

function removeButton(node) {
  const button = buttons.get(node);
  if (button) {
    button.remove();
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
