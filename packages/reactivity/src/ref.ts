import { reactive } from "./";

export function ref(val) {
  const wrapper = {
    value: val,
  };

  Object.defineProperty(wrapper, "_v_isRef", {
    value: true,
  });

  return reactive(wrapper);
}

export function toRef(obj, key) {
  const wrapper = {
    get value() {
      return obj[key];
    },
  };
  Object.defineProperty(wrapper, "_v_isRef", {
    value: true,
  });
  return wrapper;
}

export function toRefs(obj) {
  const ret = {};
  for (const key in obj) {
    ret[key] = toRef(obj, key);
  }
  return ret;
}
