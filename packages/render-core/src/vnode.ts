import { isArray, isString, ShapeFlags } from '@mini-vue/shared';
export function createVnode(type, props, children) {
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