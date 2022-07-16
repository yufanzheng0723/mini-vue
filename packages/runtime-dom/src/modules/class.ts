export function patchClass(el: HTMLElement, nextValue) {
  if (nextValue === null) {
    el.removeAttribute("class")
  } else {
    el.className = nextValue
  }
}
