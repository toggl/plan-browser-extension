import OverlayView from './overlay';
import hub from 'src/popup/utils/hub';

const overlay = {
  uid: 0,
  overlays: {},

  initialize() {
    this.registerEvents();
  },

  registerEvents() {
    hub.on('overlays:show', this.add, this);
    hub.on('overlays:hide', this.remove, this);
    hub.on('overlays:hideAll', this.removeAll, this);
  },

  add(name = this.uid++, options) {
    const overlay = new OverlayView(options);
    overlay.render();

    return (this.overlays[name] = overlay);
  },

  remove(name) {
    const overlay = this.overlays[name];
    if (overlay) {
      delete this.overlays[name];
      overlay.remove();
    }
  },

  removeAll() {
    for (const name in this.overlays) {
      const overlay = this.overlays[name];
      overlay.remove();
    }

    this.overlays = {};
  },
};

overlay.initialize();
