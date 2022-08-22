import { isArray, isObject } from "@mini-vue/shared";
import { createVnode, isVnode } from ".";

export function h(type, propsChildren, children) {
  const l = arguments.length;

  if (l === 2) {
    if (!isArray(propsChildren) && isObject(propsChildren)) {
      if (isVnode(propsChildren)) {
        // 虚拟节点包装成数组
        return createVnode(type, null, [propsChildren]);
      }
      return createVnode(type, propsChildren)
    } else {
      // 是数组
      return createVnode(type, null, propsChildren);
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    } else if (l === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsChildren, children);
  }
}