import './styles/less/popup.less';
import './styles/sass/popup.scss';

import qs from 'querystring';
import Promise from 'promise';
import Events from 'ampersand-events';
import * as api from 'src/api/api';
import TaskModel from 'src/models/task_model';
import * as collections from 'src/models/collections';
import PopupView from './popup/popup_view';

import './utils/popups';
import './utils/overlays';

function parseQuery() {
  const query = location.search.substr(1);
  return qs.parse(query);
}

function createTask(query) {
  return new TaskModel(
    {
      name: query.name || '',
      start_date: query.start_date,
      end_date: query.end_date,
      start_time: query.start_time,
      end_time: query.end_time,
      notes: query.notes,
    },
    { parse: true }
  );
}

function createHub() {
  return Events.createEmitter();
}

function createView() {
  const query = parseQuery();

  return new PopupView({
    hub: createHub(),
    task: createTask(query),
    link: query.link,
  });
}

function renderView(view) {
  try {
    view.render();
  } catch (e) {
    console.log(e);
  }
  document.body.appendChild(view.el);
  view.resizeWindow();
}

function initialize() {
  return Promise.all([api.auth.load(), collections.taskSources.fetch()]);
}

initialize().then(function() {
  const view = createView();
  renderView(view);
});
