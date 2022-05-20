export function clamp(num, min, max) {
  if (num < min) {
    return min;
  }
  if (num > max) {
    return max;
  }
  return num;
}

/**
 * Clamps a value to a lower and upper limit. The cycle starts all over from
 * the lower limit when the value exceeds the upper limit and vice versa.
 */
export function continuousClamp(lower, number, upper) {
  if (
    [lower, number, upper].some(o => o === null || o === undefined) ||
    lower > upper
  ) {
    return number;
  }

  if (number >= lower && number <= upper) {
    return number;
  }

  const between = n => n >= lower && n <= upper;
  const base = upper - lower + 1;
  const direction = Math.sign(number - lower);

  while (!between(number)) {
    number = number - base * direction;
  }

  return number;
}

/**
 * Clamps a value to a lower and upper limit. Loops back to the lower
 * limit when the value exceeds the upper limit and vice versa.
 */
export function loopClamp(lower, number, upper) {
  if (typeof number !== 'number') {
    return number;
  }

  return number < lower ? upper : number > upper ? lower : number;
}
