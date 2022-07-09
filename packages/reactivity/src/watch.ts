import { isFuncion, isObject } from "@mini-vue/shared"
import { isReactive, ReactiveEffct } from "."

export function watch(source, cb) {
  let getter

  if (isReactive(source)) {
    // 如果是reactive就递归遍历去收集依赖
    getter = () => traversal(source)
  } else if (isFuncion(source)) {
    getter = source
  } else {
    return
  }
  // 保存用户传递的函数
  let cleanup
  let oldValue
  // 用在并发场景时，只触发最后一次
  const onCleanup = (fn) => {
    cleanup = fn
  }
  const job = () => {
    // 如果有就触发
    if (cleanup) cleanup()
    const newValue = effect.run()
    cb(newValue, oldValue, onCleanup)
    oldValue = newValue
  }

  const effect = new ReactiveEffct(getter, job)

  oldValue = effect.run()
}

function traversal(value, set = new Set()) {
  if (!isObject(value)) return value
  // 如果被循环过了就直接返回上次循环的对象
  if (set.has(value)) return value
  set.add(value)
  for (const key in value) {
    traversal(value[key], set)
  }
  return value
}
