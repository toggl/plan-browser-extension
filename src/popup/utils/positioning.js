class Box {
  constructor(options = {}) {
    this.top = options.top || 0;
    this.right = options.right || 0;
    this.bottom = options.bottom || 0;
    this.left = options.left || 0;
    this.height = this.bottom - this.top;
    this.width = this.right - this.left;

    if (options.element) {
      this.extractElement(options.element);
    }
  }

  place(direction, anchor, distance = 0) {
    return (Box.directions[direction] || Box.directions['default'])(
      this,
      anchor,
      distance
    );
  }

  align(alignment, anchor) {
    return Box.alignments[alignment](this, anchor);
  }

  clip(boundaries) {
    const top = Math.min(
      Math.max(this.top, boundaries.top),
      Math.abs(boundaries.bottom - this.height)
    );
    const left = Math.min(
      Math.max(this.left, boundaries.left),
      Math.abs(boundaries.right - this.width)
    );
    return new Box({
      top,
      left,
      bottom: top + this.height,
      right: left + this.width,
    });
  }

  intersection(boundaries) {
    if (
      this.right < boundaries.left ||
      boundaries.right < this.left ||
      this.bottom < boundaries.top ||
      boundaries.bottom < this.top
    ) {
      return null;
    }
    return new Box({
      top: Math.max(this.top, boundaries.top),
      left: Math.max(this.left, boundaries.left),
      bottom: Math.min(this.bottom, boundaries.bottom),
      right: Math.min(this.right, boundaries.right),
    });
  }

  getPoint(vertical, horizontal) {
    return {
      top: Box.referencePoints[vertical](this),
      left: Box.referencePoints[horizontal](this),
    };
  }

  isInside(other) {
    return (
      other.top <= this.top &&
      other.right >= this.right &&
      other.bottom >= this.bottom &&
      other.left <= this.left
    );
  }

  extractElement(element) {
    const position = element.offset();
    this.width = element.outerWidth();
    this.height = element.outerHeight();
    this.top = position.top - $(window).scrollTop();
    this.left = position.left - $(window).scrollLeft();
    this.bottom = this.top + this.height;
    return (this.right = this.left + this.width);
  }
}

Box.directions = {
  up(element, anchor, distance = 0) {
    return new Box({
      top: anchor.top - element.height - distance,
      left: anchor.left + anchor.width / 2 - element.width / 2,
      bottom: anchor.top - distance,
      right: anchor.left + anchor.width / 2 + element.width / 2,
    });
  },
  down(element, anchor, distance = 0) {
    return new Box({
      top: anchor.bottom + distance,
      left: anchor.left + anchor.width / 2 - element.width / 2,
      bottom: anchor.bottom + element.height + distance,
      right: anchor.left + anchor.width / 2 + element.width / 2,
    });
  },
  left(element, anchor, distance = 0) {
    return new Box({
      top: anchor.top + anchor.height / 2 - element.height / 2,
      left: anchor.left - element.width - distance,
      bottom: anchor.top + anchor.height / 2 + element.height / 2,
      right: anchor.right - distance,
    });
  },
  right(element, anchor, distance = 0) {
    return new Box({
      top: anchor.top + anchor.height / 2 - element.height / 2,
      left: anchor.right + distance,
      bottom: anchor.top + anchor.height / 2 + element.height / 2,
      right: anchor.right + element.width + distance,
    });
  },
  default(element, anchor) {
    return new Box({
      top: anchor.top + anchor.height / 2 - element.height / 2,
      left: anchor.left + anchor.width / 2 - element.width / 2,
      bottom: anchor.top + anchor.height / 2 + element.height / 2,
      right: anchor.left + anchor.width / 2 + element.width / 2,
    });
  },
};

Box.alignments = {
  top(element, anchor) {
    return new Box({
      top: anchor.top,
      left: element.left,
      bottom: anchor.top + element.height,
      right: element.right,
    });
  },
  middle(element, anchor) {
    return new Box({
      top: anchor.top + anchor.height / 2 - element.height / 2,
      left: element.left,
      bottom: anchor.bottom - anchor.height / 2 + element.height / 2,
      right: element.right,
    });
  },
  bottom(element, anchor) {
    return new Box({
      top: anchor.bottom - element.height,
      left: element.left,
      bottom: anchor.bottom,
      right: element.right,
    });
  },
  left(element, anchor) {
    return new Box({
      top: element.top,
      left: anchor.left,
      bottom: element.bottom,
      right: anchor.left + element.width,
    });
  },
  center(element, anchor) {
    return new Box({
      top: element.top,
      left: anchor.left + anchor.width / 2 - element.width / 2,
      bottom: element.bottom,
      right: anchor.right - anchor.width / 2 + element.width / 2,
    });
  },
  right(element, anchor) {
    return new Box({
      top: element.top,
      left: anchor.right - element.width,
      bottom: element.bottom,
      right: anchor.right,
    });
  },
};

Box.referencePoints = {
  top(element) {
    return element.top;
  },
  middle(element) {
    return element.top + element.height / 2;
  },
  bottom(element) {
    return element.bottom;
  },
  left(element) {
    return element.left;
  },
  center(element) {
    return element.left + element.width / 2;
  },
  right(element) {
    return element.right;
  },
};

class Vector {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  direction() {
    const y = this.to.top - this.from.top;
    const x = this.to.left - this.from.left;

    return {
      horizontal: x > 0 ? 'right' : 'left',
      vertical: y > 0 ? 'down' : 'up',
    };
  }
}

export default {
  box(options = {}) {
    return new Box(options);
  },

  vector(from, to) {
    return new Vector(from, to);
  },

  // Gets direction of source point to destination point.
  //
  // @param {Object} from Source position (top, left).
  // @param {Object} to Destination position (top, left).
  // @returns {String} Direction (up, down, left, right).
  direction(from, to) {
    return this.vector(from, to).direction();
  },

  getScreen() {
    const screen = $(window);
    return this.box({
      top: 5,
      left: 5,
      bottom: screen.height() - 5,
      right: screen.width() - 5,
    });
  },
};
