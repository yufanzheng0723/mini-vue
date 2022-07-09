import { isFuncion } from "@mini-vue/shared"
import { ReactiveEffct, trackEffects, triggerEffect } from "."

class ComputedRefImpl {
  public effect
  public dirty = true
  public _v__isReadonly = true
  public _v_isRef = true
  public _value
  public dep = new Set()
  constructor(public getter, public setter) {
    this.effect = new ReactiveEffct(getter, () => {
      if (!this.dirty) {
        this.dirty = true
        // 触发一个更新
        triggerEffect(this.dep)
      }
    })
  }

  get value(): string {
    trackEffects(this.dep)
    if (this.dirty) {
      this.dirty = false
      this._value = this.effect.run()
    }

    return this._value
  }

  set value(newValue) {
    this.setter(newValue)
  }
}

export function computed(getterOrOptions) {
  const onlyGetter = isFuncion(getterOrOptions)
  let getter
  let setter
  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => {
      console.log("no setter")
    }
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }

  return new ComputedRefImpl(getter, setter)
}
