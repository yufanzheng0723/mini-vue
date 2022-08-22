import { isString, ShapeFlags } from "@mini-vue/shared"
import { createVnode, Text } from '.';
export function createRenderer(renderOptions) {

  const {
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextsibling: hostNextsibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    patchProp: hostPatchProp
  } = renderOptions

  const normalize = (child) => {
    if(isString(child)) return createVnode(Text, null, child)
    return child
  }

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = normalize(children[i])
      patch(null, child, container)
    }
  }

  const mountElement = (vnode, container) => {
    const { type, props, children, shapeFlag } = vnode
    // 将真实元素挂在到虚拟节点上
    const el = vnode.el = hostCreateElement(type)
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }
    hostInsert(el, container)
  }

  const processText = (n1, n2, container) => {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateText(n2.children, container)), container)
    }
  }

  const patch = (n1, n2, container) => {
    if (n1 === n2) return

    const { type, shapeFlag } = n2

    if (n1 === null) {
      switch (type.toString()) {
        case Text.toString():
          processText(n1, n2, container)
          break;
        default:
          if (shapeFlag & ShapeFlags.ELEMENT)
            mountElement(n2, container)
      }

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

