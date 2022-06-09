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
      console.log(s.size, "set测试");
    });
    s.delete(1);
    s.delete(6);
    s.add(4);
    const m = reactive(
      new Map([
        [1, 1],
        [2, 2],
        [3, 3],
      ])
    );
    effect(() => {
      console.log(m.get(1), "map测试");
    });
    m.set(1, 2);
  });
  it("测试map的foreach", () => {
    const p = reactive(new Map([["a", "2"]]));
    effect(() => {
      p.forEach((value, key, t) => {
        console.log(value, key, t, "测试map的foreach");
      });
    });
    p.set("b", "3");
  });
  it("测试map的for...of", () => {
    const p = reactive(new Map([["a", "1"]]));
    effect(() => {
      for (const [k, v] of p) {
        console.log(k, v, "测试map的for...of");
      }
    });
    p.set("b", "2");
  });
  it("测试map的entries", () => {
    const p = reactive(new Map([["a", "1"]]));
    for (const [k, v] of p.entries()) {
      console.log(k, v);
    }
  });
  it("测试map的values", () => {
    const p = reactive(new Map([["a", "1"]]));
    effect(() => {
      for (const v of p.values()) {
        console.log(v, "测试map的values");
      }
    });
    p.set("a", "2");
  });
  it("测试map的keys", () => {
    const p = reactive(new Map([["a", "1"]]));
    effect(() => {
      for (const k of p.keys()) {
        console.log(k, "测试map的keys");
      }
    });
    p.set("a", "22");
  });
});
