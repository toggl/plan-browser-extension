import Promise from 'bluebird';
import superagent from 'superagent';
import * as api from './api';
import config from './config';

export default function(method, url, payload) {
  return new Promise(function(resolve, reject) {
    const request = superagent[method](`${config.api.host}${url}`);
    request.set('Authorization', 'Bearer ' + api.auth.tokens.access_token);
    if (payload) {
      request.send(payload);
    }
    return request.end(function(err, response) {
      if (err) {
        return reject(err);
      }
      resolve(response.body);
    });
  });
}
