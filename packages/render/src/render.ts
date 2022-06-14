interface Options {
  createElement(tag: string): HTMLElement;
  setElementText(el: HTMLElement, text: string): void;
  insert(el: HTMLElement, parent: HTMLElement, anchor?: any): void;
  patchProps(el, key, prevValue, nextValue, shouldSetAsProps);
}
export function createRenderer(options: Options) {
  const { createElement, setElementText, insert, patchProps } = options;

  // 处理dom属性
  function shouldSetAsProps(el, key, value) {
    if (key === "form" && el.tagName === "INPUT") return false;
    return key in el;
  }

  function path(vnode1, vnode2, container: Element) {
    // 如果 n1 不存在，意味着挂载， 则调用挂载函数完成挂载
    if (!vnode1) {
      mountElement(vnode2, container);
    } else {
    }
  }

  function render(vnode, container) {
    if (vnode) {
      path(container._vnode, vnode, container);
    } else {
      if (container._vnode) {
        container.innerHTML = "";
      }
    }
    container._vnode = vnode;
  }

  function hydrate(vnode, container) {}

  function mountElement(vnode, container) {
    // 创建dom
    const el = createElement(vnode.tag);

    if (vnode.props) {
      // 处理属性
      for (const key of vnode.props) {
        patchProps(el, key, null, vnode.props[key], shouldSetAsProps);
      }
    }

    // 处理子节点
    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        path(null, child, el);
      });
    }

    // 插入到父节点
    insert(el, container);
  }

  return {
    render,
  };
}
