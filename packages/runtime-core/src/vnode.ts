import { isArray, isString, ShapeFlags } from '@mini-vue/shared';

export const Text = Symbol('Text')

export function createVnode(type, props, children = null) {
  let shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0;

  const vnode = {
    __v_isVNode: true,
    shapeFlag,
    type,
    children,
    props,
    key: props?.key,
    // 虚拟节点上的真实节点
    el: null,
  }

  if (children) {
    let type = 0;
    if (isArray(children)) {
      type = ShapeFlags.ARRAY_CHILDREN;
    } else {
      children = String(children);
      type = ShapeFlags.TEXT_CHILDREN;
    }
    vnode.shapeFlag |= type;
  }

  return vnode;

}

export function isVnode(value) {
  return !!(value && value.__v_isVNode)
}

export function isSameVnode(n1, n2) {
  return (n1.type === n2.type) && (n1.key === n2.key)
}