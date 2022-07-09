import { createRenderer } from "./src";

var renderer = createRenderer({
  createElement(tag) {
    return document.createElement(tag);
  },
  setElementText(el, text) {
    el.textContent = text;
  },
  insert(el, parent, anchor = null) {
    parent.insertBefore(el, anchor);
  },
  patchProps(el, key, prevValue, nextValue, shouldSetAsProps) {},
});

const obj = {
  tag: "div",
  children: [
    {
      tag: "div",
      children: [{ tag: "p", children: "hehe" }],
      props: { onClick: () => alert("Render11"), class: "a" },
    },
  ],
};

renderer.render(obj, document.getElementById("app"));
