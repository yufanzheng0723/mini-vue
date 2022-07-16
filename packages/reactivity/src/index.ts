export * from "./effect"
export * from "./reactive"
export * from "./baseHandle"
export * from "./computed"
export * from "./watch"
export * from "./ref"

const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (val, key) => hasOwnProperty.call(val, key)
