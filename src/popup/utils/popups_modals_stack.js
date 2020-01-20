import { isFunction, last } from 'lodash';
// 1. Maintains references to all active popups and modals
//    on the page in a stack.
// 2. Handles escape functionality to close modal/popup from top of stack.
// 3. Handles zIndex assignment for modal/popup.

const LEVEL_STEP = 5;
const elements = [];
let level = 195;

export default {
  addElement(element, type) {
    if (elements.length) {
      const { element: activeElement } = last(elements);
      this.deactivateElement(activeElement);
    }

    elements.push({ element, type });
    level += LEVEL_STEP;
  },

  removeElement(element, type) {
    if (elements.length === 0) {
      return;
    }

    const { element: elementToRemove, type: elementToRemoveType } = last(
      elements
    );

    if (element !== elementToRemove || type !== elementToRemoveType) {
      console.warn('Can only remove element from top of PopupsModalsStack');
      return;
    }

    elements.pop();
    level -= LEVEL_STEP;

    if (elements.length) {
      const { element: activeElement } = last(elements);
      this.activateElement(activeElement);
    }
  },

  deactivateElement(element) {
    if (element && isFunction(element.options.onEscape)) {
      element.options.onEscapeMuted = element.options.onEscape;
      element.options.onEscape = () => {};
    }
  },

  activateElement(element) {
    if (element) {
      element.options.onEscape = element.options.onEscapeMuted;
      delete element.options.onEscapeMuted;
    }
  },

  getCurrentLevel() {
    return level;
  },
};
