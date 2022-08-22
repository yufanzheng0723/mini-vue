export function isObject(obj) {
  return obj !== null && typeof obj === "object"
}

export function isFuncion(fn) {
  return typeof fn === "function"
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function isString(str){
  return typeof str === "string"
}

export const assign = Object.assign

export const enum ShapeFlags{
  ELEMENT = 1,
  FUNCTIONAL_COMPONENT = 1 << 1,
  STATEFUL_COMPONENT = 1 << 2,
  TEXT_CHILDREN = 1 << 3,
  ARRAY_CHILDREN = 1 << 4,
  SLOTS_CHILDREN = 1 << 5,
  TELEPORT = 1 << 6,
  SUSPENSE = 1 << 7,
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8,
  COMPONENT_KEPT_ALIVE = 1 << 9,
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT,
}