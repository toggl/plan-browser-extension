import View from 'ampersand-view';
import hub from 'src/popup/utils/hub';
import template from './template.dot';
import css from './style.module.scss';

const PremiumView = View.extend({
  template,
  css,

  events: {
    'click [data-hook=button-upgrade]': 'onSubmit',
    'click [data-hook=button-cancel]': 'onCancel',
  },

  onSubmit() {
    window.open('https://app.teamweek.com/#settings/billing', '_blank');
  },

  onCancel() {
    this.trigger('close');
  },
});

export default function(anchor) {
  hub.trigger('popups:show', {
    name: 'premium-popup',
    content: new PremiumView(),
    direction: 'down',
    positioning: {
      position: 'up',
      anchor: $(anchor),
      alignments: ['center'],
      distance: 10,
    },
    overlay: {
      closeOnClick: true,
    },
    modifiers: ['rounded', 'gray-arrow'],
  });
}
