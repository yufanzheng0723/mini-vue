import { describe, it, expect } from "vitest";
import { readonly, shallowReadonly } from "../src";

describe("readonly", () => {
  it("测试readonly", () => {
    const obj = readonly({ bar: 2 });
    expect(obj.bar).toBe(2);
    obj.bar = 3;
    const obj2 = shallowReadonly({ bar: { foo: 1 }, bar2: 1 });
    expect(obj2.bar.foo).toBe(1);
    obj2.bar.foo = 2;
    expect(obj2.bar.foo).toBe(2);
    obj2.bar2 = 2;
    expect(obj2.bar2).toBe(1);
  });
});
