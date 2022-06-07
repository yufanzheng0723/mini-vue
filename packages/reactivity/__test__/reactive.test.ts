import { describe, it, expect } from "vitest";
import { reactive, effect } from "../src";

describe("reactive", () => {
  it("测试reactive", () => {
    const obj = reactive({ bar: 1});
    effect(() => {
      console.log(obj.bar);
    });
    obj.bar = 2;
  });
});
