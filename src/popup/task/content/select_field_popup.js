import View from 'ampersand-view';

let popup;

export default View.extend({
  registerPopup(p) {
    popup = p;
    return p;
  },

  stopEditing() {
    if (popup) {
      popup.close();
      popup = null;
    }
  },
});
