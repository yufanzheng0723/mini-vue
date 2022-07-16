export function patchEvent(el: HTMLElement | any, eventName, nextValue) {
  const invokers = el._vel || (el._vel = {})

  // 是否缓存过
  const exits = invokers[eventName]

  if (exits && nextValue) {
    exits.value = nextValue
  } else {
    let event = eventName.slice(2).toLowerCase()
    if (nextValue) {
      const invoker = (invokers[eventName] = createInvoker(nextValue))
      el.addEventListener(event, (e) => invoker.value(e))
    } else if (exits) {
      el.removeEventListener(event, exits)
      invokers[eventName] = undefined
    }
  }
}
// 创建方法
function createInvoker(callback) {
  const invoker = (e) => invoker.value(e)
  invoker.value = callback
  return invoker
}
