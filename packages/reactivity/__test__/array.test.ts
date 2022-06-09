import { describe, it, expect } from "vitest";
import { effect, reactive } from "../src";

describe("array", () => {
  it("测试array", () => {
    const arr = reactive(["bar"]);
    arr.push(1);
    arr[0] = "foo";
    expect(arr[0]).toBe("foo");
  });
  it("测试includes", () => {
    const obj = {};
    const arr = reactive([obj]);
    expect(arr.includes(obj)).toBe(true);
  });
  it("测试indexOf", () => {
    const obj = {};
    const arr = reactive([obj]);
    expect(arr.indexOf(obj)).toBe(0);
  });
  it("测试push", () => {
    const a = reactive([]);
    effect(() => {
      a.push(1);
    });
    effect(() => {
      a.push(2);
    });
  });
});
