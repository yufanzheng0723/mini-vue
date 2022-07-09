import { isObject } from "@mini-vue/shared"
import { reactive, track, trigger } from "."
export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export const mutableHandle = {
  get(target, key, receiver) {
    // 是否为proxy对象，如果key是 flag 就直接返回
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    track(target, "get", key)
    const res = Reflect.get(target, key, receiver)

    // 深度代理
    if (isObject(res)) return reactive(res)

    return res
  },
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
