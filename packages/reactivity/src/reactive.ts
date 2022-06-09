import { createReactive, createReactiveSetOrMap } from "./";
export const ITERATR_KEY = Symbol();

const reactiveMap = new Map();
export function reactive(target) {
  const isSetOrMap = getTargetType(target);
  if (isSetOrMap === 1) {
    return createReactiveObject(target);
  } else if (isSetOrMap === 2) {
    // return createReactiveObject(target);
    return createReactiveSetOrMap(target);
  }
}
// 只代理第一层
export function shallowReactive(target) {
  return createReactive(target, true);
}
// 对象的reactive代理
function createReactiveObject(target) {
  // 优先通过原始对象寻找之前创建的代理对象，如果找到了就直接返回已有的代理对象
  const existionProxy = reactiveMap.get(target);
  if (existionProxy) return existionProxy;

  const proxy = createReactive(target, false);
  reactiveMap.set(target, proxy);
  return proxy;
}

// 获取目标类型
function getTargetType(target) {
  return setTargetType(target);
}
function setTargetType(target) {
  const type = Object.prototype.toString.call(target).slice(8, -1);
  switch (type) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
