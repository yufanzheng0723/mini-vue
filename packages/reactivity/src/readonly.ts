import { createReactive } from "./";

export function readonly(target) {
  return createReactive(target, false, true);
}

export function shallowReadonly(target) {
  return createReactive(target, true, true);
}
