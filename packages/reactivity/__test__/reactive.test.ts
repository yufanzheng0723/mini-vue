import { describe, it, expect } from "vitest";
import { reactive, effect, shallowReactive } from "../src";

describe("reactive", () => {
  it("测试reactive", () => {
    const obj = reactive({ bar: { foo: 1 } });
    const obj2 = shallowReactive({ bar: { foo: 1 } });

    let o = 0;
    effect(() => {
      o = obj.bar.foo;
    });
    obj.bar.foo++;

    expect(o).toBe(2);
  });
});
