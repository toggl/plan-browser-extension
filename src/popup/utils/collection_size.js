import _ from 'lodash';
import State from 'ampersand-state';

export default State.extend({
  dataTypes: {
    collection: {
      set(value) {
        return {
          val: value,
          type: _.get(value, 'isCollection') ? 'collection' : typeof value,
        };
      },
      compare(current, next) {
        return current === next;
      },
    },
  },

  props: {
    length: 'number',
    _collection: {
      type: 'collection',
      required: true,
    },
  },

  derived: {
    isEmpty: {
      deps: ['length'],
      fn() {
        return this.length === 0;
      },
    },
    hasElements: {
      deps: ['length'],
      fn() {
        return this.length > 0;
      },
    },
    hasSingle: {
      deps: ['length'],
      fn() {
        return this.length === 1;
      },
    },
  },

  constructor(collection) {
    State.call(this, { _collection: collection });
  },

  initialize() {
    this.listenToAndRun(
      this._collection,
      'add remove refresh reset',
      this.updateLength
    );
  },

  updateLength() {
    this.length = this._collection.length;
  },
});
