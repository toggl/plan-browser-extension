/**
 * Returns a custom ampersand binding that allows to bind multiple
 * classes to a single hook
 */
export function multipleClassBinding({ hook, selector } = {}) {
  return {
    type(el, value, previousValue) {
      if (previousValue?.length) {
        el.classList.remove(...(previousValue?.split(' ') ?? []));
      }

      el.classList.add(...(value?.split(' ') ?? []));
    },
    hook,
    selector,
  };
}
