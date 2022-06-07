import { describe, it, expect } from "vitest";
import { effect, reactive } from "../src";

describe("array", () => {
  it("测试array", () => {
    const arr = reactive(["bar"]);
    arr.push(1);
    arr[0] = "foo";
    expect(arr[0]).toBe("foo");
  });
  it("测试foin", () => {
    const arr = reactive([1]);
    effect(() => {
      for (const i in arr) {
        console.log(i);
      }
    });
    arr[1] = 2
    arr.length = 0
  });
});
