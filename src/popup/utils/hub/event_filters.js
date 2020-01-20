import _ from 'lodash';

const filterListener = (filterMethod, filter, callback) => args => {
  if (args.length > 0) {
    const filtered = filterMethod(args[0], filter);
    if (filtered.length === 1) {
      callback(...args);
    }
  }
};

export default {
  listenToWhere(where, eventDispatcher, eventName, callback) {
    this.listenTo(
      eventDispatcher,
      eventName,
      filterListener(_.filter, where, callback)
    );
  },

  listenToFilter(filter, eventDispatcher, eventName, callback) {
    this.listenTo(
      eventDispatcher,
      eventName,
      filterListener(_.filter, filter, callback)
    );
  },

  listenToAll(eventDispatcher, events, callback, thisArg, once = false) {
    const after = _.after(events.length, () => {
      callback.call(thisArg);
      if (!once) {
        this.listenToAll(eventDispatcher, events, callback, thisArg);
      }
    });

    events.forEach(event => {
      this.listenToOnce(eventDispatcher, event, after);
    });
  },

  listenToAllOnce(eventDispatcher, events, callback, thisArg) {
    this.listenToAll(eventDispatcher, events, callback, thisArg, true);
  },
};
