import { snakeCase as _snakeCase } from 'lodash';

/**
 * Converts the given string to snake_case
 */
export function toSnakeCase(text) {
  return _snakeCase(text);
}

/**
 * Converts keys of the given object to snake_case
 */
export function toSnakeCaseObject(object) {
  const ret = {};
  Object.entries(object).forEach(([k, v]) => {
    ret[toSnakeCase(k)] = v;
  });
  return ret;
}
