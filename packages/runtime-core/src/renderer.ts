import { isString, ShapeFlags } from "@mini-vue/shared"
import { createVnode, isSameVnode, Text } from '.';
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
    if (isString(child)) return createVnode(Text, null, child)
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

  const patchProps = (oldProps, newProps, el) => {
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key])
    }
    // 如果老的有新的没有就删除
    for (const key in oldProps) {
      if (newProps[key] === null) {
        hostPatchProp(el, key, oldProps[key], null)
      }
    }
  }

  const patchChildren = (n1, n2, el) => {
    const c1 = n1 && n1.children
    const c2 = n2 && n2.children

    
  }

  const patchElement = (n1, n2) => {
    // 先复用节点，再比较属性，再比较子元素
    const el = n2.el = n1.el
    const oldProps = n1.props || {}
    const newProps = n2.props || {}

    patchProps(oldProps, newProps, el)
    patchChildren(n1, n2, el)
  }

  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      mountElement(n2, container)
    } else {
      patchElement(n1, n2)
    }
  }

  const processText = (n1, n2, container) => {
    if (n1 === null) {
      hostInsert((n2.el = hostCreateText(n2.children, container)), container)
    } else {
      const el = n2.el = n1.el
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children)
      }
    }
  }

  const patch = (n1, n2, container) => {
    if (n1 === n2) return

    // 判断两个元素是否相同，不同卸载
    if (n1 && !isSameVnode(n1, n2)) {
      // 删除老的
      unmount(n1)
      n1 = null
    }

    const { type, shapeFlag } = n2

    switch (type.toString()) {
      case Text.toString():
        processText(n1, n2, container)
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container)
    }
  }

  const unmount = (vnode) => {
    hostRemove(vnode.el)
  }

  const render = (vnode, container) => {

    if (vnode === null) {
      // 卸载
      if (container._vnode) {
        unmount(container._vnode)
      }
    } else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return {
    render,
  }
}

