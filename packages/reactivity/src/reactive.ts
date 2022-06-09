import { readonly, track, trigger } from "./";

export const ITERATR_KEY = Symbol("iterate");

export function reactive(target) {
  return createReactive(target, false);
}
// 只代理第一层
export function shallowReactive(target) {
  return createReactive(target, true);
}

export function createReactive(
  target: object,
  isShallow = false,
  isReadonly = false
) {
  const obj = new Proxy(target, {
    get(target, key, receiver) {
      if (key === "raw") {
        return target;
      }
      // 非只读时才建立响应关系
      if (!isReadonly && typeof key !== "symbol") {
        track(target, key);
      }
      const res = Reflect.get(target, key, receiver);

      // 如果是使用shallowReactive第一层就直接返回res
      if (isShallow) {
        return res;
      }
      // 如果是使用reactive代理的就递归代理深层对象
      if (typeof res === "object" && res !== null) {
        return isReadonly ? readonly(res) : reactive(res);
      }
      return res;
    },
    set(target, key, value, receiver) {
      if (isReadonly) {
        console.warn(`${key.toString()} 是只读的`);
        return true;
      }
      // 旧值
      const oldValue = target[key];
      // 如果属性不存在，则说明是添加新属性，否则是设置已有属性
      const type = Array.isArray(target)
        ? Number(key) < target.length
          ? "SET"
          : "ADD"
        : Object.prototype.hasOwnProperty.call(target, key)
        ? "SET"
        : "ADD";
      // 当对象新增属性时，触发响应函数
      const res = Reflect.set(target, key, value, receiver);
      // 如果receiver是target的代理对象就执行
      if (target === receiver.raw) {
        // 只有当值真正发生变化时才触发副作用函数,并且都不是NaN的情况下才触发
        if (oldValue !== value && (oldValue === oldValue || value === value)) {
          trigger(target, key, type, value);
        }
      }

      return res;
    },
    // 代理对象的delete方法
    deleteProperty(target, key) {
      // 如果是只读的，就警告
      if (isReadonly) {
        console.warn(`${key.toString()} 是只读的`);
        return true;
      }
      // 检查备操作属性是否是对象自己的属性
      const hadKey = Object.prototype.hasOwnProperty.call(target, key);
      const res = Reflect.deleteProperty(target, key);
      // 只有当被删除的属性是对象自己的属性时才触发副作用函数
      if (res && hadKey) {
        trigger(target, key, "DELETE");
      }
      return res;
    },
    // 拦截in操作符
    has(target, key) {
      return Reflect.has(target, key);
    },
    // 拦截for...in循环
    ownKeys(target) {
      track(target, Array.isArray(target) ? "length" : ITERATR_KEY);
      return Reflect.ownKeys(target);
    },
  });
  return obj;
}
