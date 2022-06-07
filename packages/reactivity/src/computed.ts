import { effect, trigger, track } from "./";

export function computed(getter) {
  // 缓存上一次的结果
  let value;
  // 用来标识是否需要重新计算，为true时需要重新计算
  let dirty = true;

  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      if (!dirty) {
        dirty = true;
        // 当依赖数据发生变化时，手动调用trigger函数触发响应
        trigger(obj, "value");
      }
    },
  });

  const obj = {
    // 当读取的时候才执行副作用函数
    get value() {
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      track(obj, "value");
      return value;
    },
  };
  return obj;
}
