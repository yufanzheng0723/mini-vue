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
  it("测试set与map", () => {
    const s = reactive(new Set([1, 2, 3]));
    effect(() => {
      console.log(s.size);
    });
    s.delete(1);
    s.delete(6);
    s.add(4);
  });
});
