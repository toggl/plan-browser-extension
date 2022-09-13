import moment from 'moment';

export const track = function(category, action) {
  console.log(category, action);

  chrome.runtime.sendMessage({
    type: 'track_event',
    category,
    action,
    fields: {
      dimension1: location.hostname,
      dimension2: location.href,
    },
  });
};

export const trackTaskCreated = function(task, statusName, segmentName) {
  chrome.runtime.sendMessage({
    type: 'task_created',
    properties: {
      task_id: task.id,
      extension: IS_FIREFOX ? 'firefox' : 'chrome',
      ...getCreateTaskTraits(
        task,
        statusName?.toLowerCase(),
        segmentName ?? ''
      ),
    },
  });
};

function getCreateTaskTraits(task, statusName = '', segmentName = '') {
  const status = 'no status' === statusName ? false : !!statusName;
  const segment = Boolean(segmentName && !~segmentName.search('Default'));
  const assignees = task.workspace_members.length;
  const tags = task.tag_ids.length;
  const time_estimate = [
    task.estimated_minutes ? task.estimate_type : 'none',
    task.estimated_minutes && task.estimate_skips_weekend ? ' WD' : '',
  ].join('');
  const times = Boolean(task.start_time || task.end_time);
  const comments = false;
  const notes = Boolean(task.notes?.length ?? 0);
  const checklist_items = 0;
  const files = 0;
  const dates =
    task.start_date && task.end_date
      ? moment.utc(task.end_date).diff(moment.utc(task.start_date), 'days')
      : 0;
  const plan = task.project_id || task.plan_id;
  const recurring = 'never';

  return {
    dates,
    times,
    assignees,
    time_estimate,
    tags,
    checklist_items,
    comments,
    files,
    notes,
    plan,
    segment,
    status,
    recurring,
  };
}
