import Promise from 'bluebird';
import hub from 'src/popup/utils/hub';

export function createProject(attrs) {
  return new Promise(function(resolve, reject) {
    hub.on('project:added-and-reloaded', resolve);
    hub.on('project:add:failed', reject);
    hub.trigger('project:add', attrs);
  });
}

export function createSegment(attrs) {
  return new Promise(function(resolve, reject) {
    hub.on('segment:added', resolve);
    hub.on('segment:add:failed', reject);
    hub.trigger('segment:add', attrs);
  });
}

export function createUser() {}
