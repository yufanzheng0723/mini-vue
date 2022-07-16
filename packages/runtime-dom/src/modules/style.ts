export function patchStyle(el: HTMLElement, preValue, nextValue) {
  // 样式比对差异，直接覆盖
  for (const key in nextValue) {
    el.style[key] = nextValue[key]
  }

  // 如果老值存在并且为空，则删除
  if (preValue) {
    for (const key in preValue) {
      if (nextValue[key] === null) {
        el.style[key] = null
      }
    }
  }
}
