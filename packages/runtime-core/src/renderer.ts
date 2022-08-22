export function createRenderer(renderOptions) {

  const {
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElement,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextsibling: hostNextsibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp
  } = renderOptions


  const mountElement = (vnode, container) => {
    const { type, props } = vnode
    // 将真实元素挂在到虚拟节点上
    const el = vnode.el = hostCreateElement(type)
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    hostInsert(el, container)
  }

  const patch = (n1, n2, container) => {
    if (n1 === n2) return

    if (n1 === null) {

    } else {

    }
  }

  const render = (vnode, container) => {

    if (vnode === null) {
      // 卸载

    } else {
      patch(null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render,
  }
}

