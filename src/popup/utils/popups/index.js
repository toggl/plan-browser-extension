import _ from 'lodash';
import hub from 'src/popup/utils/hub';
import positioningModule from './positioning';
import popupsModalsStack from './popups_modals_stack';
import PopupView from './popup';

const extractAnchor = function(options = {}) {
  const box = options.anchor
    ? positioningModule.box({ element: options.anchor })
    : null;
  const screenBox = positioningModule.getScreen();
  const intersection = box ? box.intersection(screenBox) : null;

  return {
    isPrecise: !!intersection,
    anchor: intersection || screenBox,
  };
};

const positionTooltip = function(
  tooltipElement,
  popupBox,
  anchorBox,
  position
) {
  let positionProp;
  let positionValue;
  const minEdgeOffset = 12.5;

  if (position === 'up' || position === 'down') {
    positionProp = 'left';
    positionValue = Math.max(
      minEdgeOffset,
      anchorBox.left - popupBox.left + anchorBox.width / 2
    );
  } else if (position === 'right' || position === 'left') {
    positionProp = 'top';
    positionValue = Math.max(
      minEdgeOffset,
      anchorBox.top - popupBox.top + anchorBox.height / 2
    );
  }

  tooltipElement.css({
    [positionProp]: positionValue,
  });
};

const positionPopup = function(popup, options) {
  const extracted = extractAnchor(options);
  const isPrecise = extracted.isPrecise;
  let anchor = extracted.anchor;

  if (!isPrecise && popup.anchor) {
    anchor = popup.anchor;
  }
  // Cache the anchor so that if the popup is positioned with a rerendered
  // anchor it still goes to the correct location
  if (isPrecise && !popup.anchor) {
    popup.anchor = anchor;
  }

  const popupBox = positioningModule.box({ element: popup.$el });
  const positioning = getValidPositioning(popupBox, anchor, options);

  const cssOptions = {
    top: positioning.position.top + _.get(options, 'offsets.top', 0),
    left: positioning.position.left + _.get(options, 'offsets.left', 0),
  };

  if (options.top) {
    cssOptions.top = options.top;
  }

  if (options.left) {
    cssOptions.left = options.left;
  }

  const popupEl = popup.$el.css(cssOptions);

  if (isPrecise) {
    positionTooltip(
      popup.$tooltip,
      positioning.position,
      anchor,
      options.position
    );
  } else {
    popupEl.addClass('triangle-hide');
  }

  return popupEl;
};

const getValidPositioning = function(popup, anchor, options = {}) {
  const boundaries = positioningModule.getScreen();
  const position = popup.place(options.position, anchor, options.distance || 0);
  const positions = _.map(options.alignments || [], alignment => ({
    name: alignment,
    position: position.align(alignment, anchor),
  }));

  let valid = _.find(positions, alignment =>
    alignment.position.isInside(boundaries)
  );

  if (!valid) {
    valid = positions[0] || { name: 'default', position };
  }

  if (options.clip !== false) {
    valid.position = valid.position.clip(boundaries);
  }

  return valid;
};

let popups = [];

/*
@param {Object} options Popup options.
@param {String} options.name Popup name.
@param {Object} options.content Popup content.
@param {Boolean} options.focusFirstInput Give focus to the
                first visible enabled input field.
@param {String} options.direction Popup direction based on anchor.
                (up, down, left, right)
@param {Object} options.positioning.anchor Popup anchor.
@param {String} options.positioning.position Popup position to anchor.
                (up, down, left, right, default)
@param {Array} options.positioning.alignments Popup alignments based on
               anchor. (top, middle, bottom, left, center, right)
@param {Number} options.positioning.distance Popup distance from anchor.
@param {Boolean} options.positioning.clip Clips popup overflow.
@param {Boolean} options.overlay.exists - default true.
@param {Boolean} options.overlay.transparent Popup overlay transparency.
@param {Boolean} options.overlay.closeOnClick Closes popup on clicking
@param {Function} options.onClose Close event handler
*/

const showPopup = function(options) {
  if (options.positioning && options.positioning.anchor) {
    options.positioning.anchor = $(options.positioning.anchor);
  }
  const level = popupsModalsStack.getCurrentLevel();
  const overlayLevel = level - 1;

  const showOverlay = _.get(options, 'overlay.exists', true);
  const transparentOverlay = _.get(options, 'overlay.transparent', true);

  const { content, positioning } = options;

  const popup = new PopupView({
    content,
    level,
    name: options.name,
    direction: options.direction,
    modifiers: options.modifiers,
    hideArrow: options.hideArrow,
    onEscape: () => {
      content.trigger('close');
    },
  });

  popupsModalsStack.addElement(popup, 'popup');

  _.defer(() => {
    popup.listenTo(content, 'resize', () => {
      positionPopup(popup, positioning);
    });

    popup.listenTo(content, 'alert', () => {
      popup.$el.addClass('alert');
    });

    popup.listenTo(content, 'close', () => {
      popupsModalsStack.removeElement(popup, 'popup');

      if (_.isFunction(options.onClose)) {
        options.onClose();
      }

      popups = popups.filter(p => p !== popup);

      if (popups.length === 0) {
        hub.trigger('popups:close:last');
      }
    });

    popup.listenTo(content, 'onboard:show', () => {
      popup.el.classList.add('popup--onboard');
    });

    popup.listenTo(content, 'onboard:hide', () => {
      popup.el.classList.remove('popup--onboard');
    });

    popup.listenTo(hub, 'shortcut:submit', () => {
      content.trigger('submit');
    });

    popup.listenTo(hub, 'popups:close', () => {
      content.trigger('close');
    });

    if (showOverlay) {
      const overlay = {
        transparent: transparentOverlay,
        level: overlayLevel,
      };

      const closeOnClick = _.get(options, 'overlay.closeOnClick', true);
      if (closeOnClick) {
        overlay.onClick = () => {
          content.trigger('close');
        };
      }

      hub.trigger('overlays:show', popup.cid, overlay);

      popup.listenTo(content, 'close', () => {
        hub.trigger('overlays:hide', popup.cid);
        hub.trigger('popup:close:done', popup.cid);
      });
    }

    popup.render();
    content.trigger('rendered');

    if (positioning) {
      positionPopup(popup, positioning);
    }

    if (options.focusFirstInput) {
      popup.$el.find('input:enabled:visible:first').focus();
    }

    hub.trigger(`popups:showed:${options.name}`);

    popups = popups.concat(popup);

    if (popups.length === 1) {
      hub.trigger('popups:open:first');
    }
  });
};

const initialize = () => {
  hub.on('popups:show', showPopup);
};

initialize();
