import { ref, effect, reactive, toRef, toRefs } from "../src";
import { describe, it, expect } from "vitest";

describe("ref", () => {
  it("测试ref", () => {
    const p = ref(1);
    effect(() => {
      console.log(p.value, "测试ref");
    });
    p.value = 2;
  });
  it("测试toRef", () => {
    const p = reactive({ foo: 1 });
    const f = toRef(p, "foo");
    effect(() => {
      console.log(f.value, "测试toRef");
      console.log(p.foo, "测试toRef");
    });
    p.foo = 2;
  });
  it("测试toRefs", () => {
    const p = reactive({ foo: 1, bar: 2 });
    const { foo, bar } = toRefs(p);
    expect(foo.value).toBe(1);
    p.foo = 2;
    expect(foo.value).toBe(2);
  });
});
