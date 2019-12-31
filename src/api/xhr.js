import Promise from 'bluebird';
import superagent from 'superagent';
import * as api from './api';
import config from './config';

export default function xhr(method, url, payload) {
  return new Promise(function(resolve, reject) {
    const request = superagent[method](`${config.api.host}${url}`);
    request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);
    if (payload) {
      request.send(payload);
    }
    request.end(async function(error, response) {
      if (!response) {
        reject({ message: 'network_error', error });
      } else if (response.unauthorized) {
        try {
          await api.auth.refreshTokens();
          await xhr(method, url, payload);
        } catch (e) {
          reject(e);
        }
      } else if (response.ok) {
        resolve(response.body);
      } else {
        reject({ message: 'unknown_error' });
      }
    });
  });
}
