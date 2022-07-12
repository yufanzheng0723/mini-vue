import { isObject } from "@mini-vue/shared"
import { reactive, reactiveMap, readonly, readonlyMap, track, trigger } from "."
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

const get = createGetter()
const readonlyGet = createGetter(true)

export const mutableHandle = {
  get,
  set(target, key, value, receiver) {
    // 拿到原始值
    const oldValue = target[key]
    const res = Reflect.set(target, key, value, receiver)
    // 判断值是否变化，如果变化就触发更新
    if (oldValue !== value) {
      trigger(target, "set", key, value, oldValue)
    }
    return res
  },
}

export const readonlyHandle = {
  get: readonlyGet,
  set(target, key) {
    debugger

    console.log(`Set operation on key "${key}" failed: target is readonly.`)
    return true
  },
}

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    // 是否为proxy对象，如果key是 flag 就直接返回
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
      key === ReactiveFlags.RAW &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
      return target
    }

    if (!isReadonly) track(target, "get", key)

    const res = Reflect.get(target, key, receiver)

    // 深度代理
    if (isObject(res) && !isReadonly)
      return isReadonly ? readonly(res) : reactive(res)

    return res
  }
}
