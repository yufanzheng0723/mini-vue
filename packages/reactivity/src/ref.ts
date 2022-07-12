import { isObject, isArray } from "@mini-vue/shared"
import { reactive, trackEffects, triggerEffect } from "."

class RefImpl {
  public _value
  public dep = new Set()
  public _v_isRef = true
  constructor(public rawValue) {
    this._value = toReactive(rawValue)
  }
  get value() {
    trackEffects(this.dep)
    return this._value
  }
  set value(newVal) {
    if (this.rawValue !== newVal) {
      this._value = toReactive(newVal)
      this.rawValue = newVal
      triggerEffect(this.dep)
    }
  }
}

export function ref(obj) {
  return new RefImpl(obj)
}

function toReactive(obj) {
  return isObject(obj) ? reactive(obj) : obj
}

class ObjectRefImpl {
  constructor(public obj, public key) {}

  public get value(): string {
    return this.obj[this.key]
  }

  public set value(newVal) {
    this.obj[this.key] = newVal
  }
}

export function toRef(obj, key) {
  return new ObjectRefImpl(obj, key)
}

export function toRefs(obj) {
  const res = isArray(obj) ? new Array(obj.length) : {}

  for (const key in obj) {
    res[key] = toRef(obj, key)
  }

  return res
}

// 在模板中使用时脱 ref
export function proxyRefs(obj) {
  return new Proxy(obj, {
    get(target, key, recevier) {
      const r = Reflect.get(target, key, recevier)
      return unRef(r)
    },
    set(target, key, value, recevier) {
      const oldValue = target[key]
      if (isRef(oldValue)) {
        oldValue.value = value
        return true
      } else {
        return Reflect.set(target, key, value, recevier)
      }
    },
  })
}

export function isRef(obj) {
  return obj._v_isRef
}

export function unRef(obj) {
  return isRef(obj) ? obj.value : obj
}
