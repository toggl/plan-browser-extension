import { nanoid } from 'nanoid/non-secure';

export function randomString(size) {
  return nanoid(size);
}
