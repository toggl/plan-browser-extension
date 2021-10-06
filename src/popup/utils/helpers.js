import _ from 'lodash';
import Promise from 'bluebird';
import * as utils from 'src/utils';
import xhr from 'src/api/xhr';

const MAX_NAME_LENGTH = 30;

export async function createProject({ workspace }, attrs) {
  return new Promise(resolve => {
    const project = workspace.projects.create(attrs);
    project.once('sync', resolve);
  });
}

export async function createSegment({ project }, attrs) {
  return new Promise(resolve => {
    const segment = project.segments.create(attrs);
    segment.once('sync', resolve);
  });
}

export async function createStatus({ project }, attrs) {
  return new Promise(resolve => {
    const status = project.statuses.create(attrs);
    status.once('sync', resolve);
  });
}

export async function createUser({ workspace }, { name, role = 'regular' }) {
  let email = '';
  if (utils.isEmail(name)) {
    email = name;
    name = email.substr(0, email.indexOf('@'));
  }

  name = name.substring(0, MAX_NAME_LENGTH);

  const data = await xhr('post', `/api/v6-rc1/${workspace.id}/dummy_users`, {
    role,
    name,
  });

  const user = workspace.users.add({
    ...data,
    ...{
      email,
      initials: _.get(data, 'initials', ''),
      picture_url: '/avatars/s50/missing.png',
      weight: 0,
      position: 0,
      role,
      dummy: true,
      active: true,
    },
  });

  if (email) {
    await xhr(
      'post',
      `/api/v6-rc1/${workspace.id}/dummy_users/${user.id}/invitation`,
      { email }
    );
  }

  return user;
}
