import Promise from 'bluebird';
import emailValidator from 'email-validator';

export const sleep = ms => new Promise(r => setTimeout(r, ms));

export function isEmail(email) {
  return emailValidator.validate(email);
}
