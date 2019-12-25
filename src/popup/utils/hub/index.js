import _ from 'lodash';
import Events from './events';

const hub = {
  initialize() {
    return (this.channels = {});
  },

  get(name) {
    return this.channels[name] || (this.channels[name] = this.build());
  },

  build() {
    return _.extend({}, Events);
  },

  debug(name) {
    const channel = name ? this.get(name) : this;
    channel._trigger = channel.trigger;
    channel.trigger = function(eventName, ...more) {
      console.groupCollapsed('Hub: ' + eventName);
      for (let i = 0; i < more.length; i++) {
        const val = more[i];
        let type = typeof val;
        if (val instanceof Array) {
          type = 'array';
        }
        if (!_.isNil(val)) {
          console.log(`%c${type}`, 'color:lightGray;font-weight:bold;', val);
        } else {
          console.log(val);
        }
      }
      console.groupEnd();
      return channel._trigger.apply(this, arguments);
    };
  },
};

_.extend(hub, Events);

hub.initialize();

/*
All global events
*/
hub.events = {
  TOUCH: 'touch',
  DRAG: 'drag', //hammer event
  DRAG_START: 'dragstart', //hammer event
  DRAG_END: 'dragend', //hammer event
  RELEASE: 'release', //hammer event
  SHADOW_MOVE: 'shadow-move', //data
  SHADOW_REMOVE: 'shadow-remove',
};

export default window.hub = hub;
