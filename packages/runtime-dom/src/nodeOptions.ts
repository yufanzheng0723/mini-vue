export const nodeOptions = {
  insert(child, parent, anchor = null) {
    parent.insertBefore(child, anchor)
  },
  remove(child) {
    const parent = child.parentNode
    if (parent) parent.removeChild(child)
  },
  setElementText(el, text) {
    el.textContent = text
  },
  setText(node, text) {
    node.nodeValue = text
  },
  querySelector(selector) {
    return document.querySelector(selector)
  },
  parentNode(node) {
    return node.parentNode
  },
  nextSibling(node) {
    return node.nextSibling
  },
  createElement(tag) {
    return document.createElement(tag)
  },
  createText(text) {
    return document.createTextNode(text)
  },
}
