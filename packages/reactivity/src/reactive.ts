import { createReactive } from "./";
export const ITERATR_KEY = Symbol("iterate");

const reactiveMap = new Map();
export function reactive(target) {
  // 优先通过原始对象寻找之前创建的代理对象，如果找到了就直接返回已有的代理对象
  const existionProxy = reactiveMap.get(target);
  if (existionProxy) return existionProxy;

  const proxy = createReactive(target, false);
  reactiveMap.set(target, proxy);
  return proxy;
}
// 只代理第一层
export function shallowReactive(target) {
  return createReactive(target, true);
}
