import { track, trigger } from "./";

export function reactive(target: object) {
  const obj = new Proxy(target, {
    get(target, key) {
      track(target, key);
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      trigger(target, key);
      return true;
    },
  });
  return obj;
}
