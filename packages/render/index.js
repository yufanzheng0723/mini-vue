const useRender = render.createRenderer({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    if (parent) parent.appendChild(el);
  },
  patchProps(el, key, prevValue, nextValue, shouldSetAsProps) {
    if (/^on/.test(key)) {
      // 获取钙元素伪造的事件处理函数
      let invoker = el._vei;
      const name = key.slice(2).toLowerCase();
      if (nextValue) {
        // 如果没有就伪造一个缓存在 el._vei 上
        if (!invoker) {
          invoker = el._vei = function (e) {
            el[key](e);
          };
          // 将真正的时间处理函数赋值给 invoker.value
          invoker.value = nextValue;
          // 绑定事件
          el.addEventListener(name, invoker);
        } else {
          // 如果invoker存在，就更新，并且只需要更新invoker.value的值就好了
          invoker.value = nextValue;
        }
      } else if (invoker) {
        // 新的事件绑定函数不存在，且之前绑定的 invoker 存在，则移除绑定
        el.removeEventListener(name, invoker);
      }
    } else if (key === "class") {
      el.className = nextValue;
    } else if (shouldSetAsProps(el, key, nextValue)) {
      const type = typeof el[key];
      if (type === "boolean" && nextValue === "") {
        el[key] = true;
      } else {
        el[key] = false;
      }
    } else {
      el.setAttribute(key, nextValue);
    }
  },
});

const { render: renderFn } = useRender;

const obj = {
  type: "div",
  children: [
    {
      type: "div",
      children: [{ type: "p", children: "hehe" }],
      props: { onClick: () => alert("Render11"), class: "a" },
    },
  ],
};

renderFn(obj, document.getElementById("app"));
