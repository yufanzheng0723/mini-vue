import { isArray, isObject } from "@mini-vue/shared"
import {
  hasOwn,
  pauseTracking,
  reactive,
  reactiveMap,
  readonly,
  readonlyMap,
  resetTracking,
  toRaw,
  track,
  trigger,
} from "."

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
  RAW = "__v_raw",
}

const get = createGetter()
const readonlyGet = createGetter(true)

const arrayInstrumentations = createArrayInstrumentations()

function createArrayInstrumentations() {
  const instrumentations = {}

  ;(["includes", "indexOf", "lastIndexOf"] as const).forEach((key) => {
    instrumentations[key] = function (this, ...args) {
      // 先把找到原始对象
      const arr = toRaw(this)
      // 创建依赖
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "")
      }
      // 先使用原始数据的方法，他也有可能是 proxy 对象
      const res = arr[key](...args)
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw))
      } else {
        return res
      }
    }
  })
  ;(["push", "pop", "shift", "unshift", "splice"] as const).forEach((key) => {
    instrumentations[key] = function (this, ...args) {
      pauseTracking()
      const res = toRaw(this)[key].apply(this, args)
      resetTracking()
      return res
    }
  })

  return instrumentations
}

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

    // 如果是数组就进行特殊处理
    const targetIsArray = isArray(target)
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, target)
    }

    const res = Reflect.get(target, key, receiver)

    // 深度代理
    if (isObject(res) && !isReadonly)
      return isReadonly ? readonly(res) : reactive(res)

    return res
  }
}
