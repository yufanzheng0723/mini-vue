export function isObject(obj) {
  return obj !== null && typeof obj === "object"
}

export function isFuncion(fn) {
  return typeof fn === "function"
}

export function isArray(arr) {
  return Array.isArray(arr)
}
