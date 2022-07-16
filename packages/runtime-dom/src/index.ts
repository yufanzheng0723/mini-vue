import { patchProp } from "./patchProp"
import { nodeOptions } from "./nodeOptions"
import { createRenderer } from "@mini-vue/render-core"

const renderOptions = Object.assign(nodeOptions, {
  patchProp,
})

export function render(vnode, container) {
  createRenderer(renderOptions).render(vnode, container)
}
