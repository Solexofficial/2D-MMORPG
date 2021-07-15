/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
export function clamp(x, from_x, to_x) {
  if (x < from_x) x = from_x;
  if (x > to_x) x = to_x;

  return x;
}

export default clamp;
