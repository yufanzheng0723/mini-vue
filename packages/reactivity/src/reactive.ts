import { isObject } from "@mini-vue/shared"
import { mutableHandle, ReactiveFlags } from "."

const reactiveMap = new WeakMap()

export function reactive(obj) {
  if (!isObject(obj)) {
    return
  }

  // 是否为proxy对象，访问对象的get方法
  if (obj[ReactiveFlags.IS_REACTIVE]) {
    return obj
  }

  // 如果已经缓存过了，就直接返回缓存的对象
  const exisitingProxy = reactiveMap.get(obj)
  if (exisitingProxy) {
    return exisitingProxy
  }

  const proxy = new Proxy(obj, mutableHandle)
  // 缓存proxy，防止重复代理
  reactiveMap.set(obj, proxy)
  return proxy
}
