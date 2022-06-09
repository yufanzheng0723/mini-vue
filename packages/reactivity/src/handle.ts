import { readonly, track, trigger } from "./";
import { reactive } from "./";
import { ITERATR_KEY } from "./";

const originMethod = Array.prototype.includes;
const arrayInstrumentations = {
  includes: function (...args) {
    // this是代理对象，先在代理对象中查找，将结果储存在res中
    let res = originMethod.apply(this, args);
    if (res === false) {
      // 如果没有的话就通过this.raw拿到原始数组，再去其中查找并更新res的值
      res = originMethod.apply(this.raw, args);
    }
    return res;
  },
};

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
      // 如果操作对象是数组并且key存在于arrayInstrumentations中，则执行相应的方法
      // 返回的是定义在arrayInstrumentations上的值
      if (Array.isArray(target) && arrayInstrumentations.hasOwnProperty(key)) {
        return Reflect.get(arrayInstrumentations, key, receiver);
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
