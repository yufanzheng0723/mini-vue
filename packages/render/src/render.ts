interface Options {
  createElement(tag: string): HTMLElement;
  setElementText(el: HTMLElement, text: string): void;
  insert(el: HTMLElement, parent: HTMLElement, anchor?: any): void;
  patchProps(el, key, prevValue, nextValue, shouldSetAsProps);
}
export function createRenderer(options: Options) {
  const { createElement, setElementText, insert, patchProps } = options;
  function patch(n1, n2, container) {
    if (n1 && n1.type !== n2.type) {
      unmout(n1);
      n1 = null;
    }
    const { type } = n2;
    if (typeof type === "string") {
      if (!n1) {
        mountElement(n2, container);
      }
    }
  }

  function shouldSetAsProps(el, key, value) {
    if (key === "form" && el.tagName === "INPUT") return false;
    return key in el;
  }

  function mountElement(vnode, container) {
    // 创建元素
    const el = (vnode.el = createElement(vnode.type));

    if (typeof vnode.children === "string") {
      setElementText(el, vnode.children);
    } else if (Array.isArray(vnode.children)) {
      vnode.children.forEach((element) => {
        patch(null, element, el);
      });
    }
    if (vnode.props) {
      for (const key in vnode.props) {
        patchProps(el, key, null, vnode.props[key], shouldSetAsProps);
      }
    }
    insert(el, container);
  }

  function unmout(vnode) {
    const parent = vnode.el.parentNode;
    if (parent) parent.removeChild(vnode.el);
  }

  function render(vnode, container) {
    if (vnode) {
      patch(container?._vnode, vnode, container);
    } else {
      if (container._vnode) {
        unmout(container._vnode);
      }
    }
    // 把vnode储存到container._vnode下，即后续渲染中的旧vnode
    container._vnode = vnode;
  }

  function hydrate(vnode, container) {}

  return {
    render,
    hydrate,
  };
}
