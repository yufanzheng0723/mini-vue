import { describe, it, expect } from "vitest";
import { reactive, effect } from "../src";

describe("reactive", () => {
  it("测试reactive", () => {
    let obj: any = reactive({
      a: 1,
    });
    let b;
    effect(() => {
      b = obj.a;
    });
    expect(b).toBe(1);
    obj.a = 2;
    expect(b).toBe(2);
    obj.a = 222222;
    expect(b).toBe(222222);
    
  });
});
