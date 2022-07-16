import { isObject } from "@mini-vue/shared"
import { mutableHandle, ReactiveFlags, readonlyHandle } from "."

export const reactiveMap = new WeakMap()
export const readonlyMap = new WeakMap()

export function reactive(target: object) {
  if (isReactive(target)) {
    return target
  }
  return createReactiveObject(target, false, mutableHandle, reactiveMap)
}

export function readonly(target: object) {
  return createReactiveObject(target, true, readonlyHandle, readonlyMap)
}

function createReactiveObject(
  target,
  isReadonly: boolean,
  mutableHandlers,
  proxyMap
) {
  if (!isObject(target)) {
    return target
  }

  // 是否为proxy对象，或者是否是只读对象
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }

  // 如果已经缓存过了，就直接返回缓存的对象
  const exisitingProxy = proxyMap.get(target)
  if (exisitingProxy) {
    return exisitingProxy
  }

  const proxy = new Proxy(target, mutableHandlers)
  // 缓存proxy，防止重复代理
  proxyMap.set(target, proxy)
  return proxy
}

export function isReactive(obj) {
  return !!(obj && obj[ReactiveFlags.IS_REACTIVE])
}

export function isReadonly(obj) {
  return !!(obj && obj[ReactiveFlags.IS_READONLY])
}

export function toRaw(observed) {
  const raw = observed && observed[ReactiveFlags.RAW]
  return raw ? toRaw(raw) : observed
}
