import { describe, it, expect } from "vitest";
import { reactive, watch } from "../src";

describe("watch", () => {
  it("测试watch", () => {
    let a = reactive({
      foo: 1,
    });
    let c = 0;
    watch(
      () => a.foo,
      (val, old) => {
        c++;
      },
      {
        immediate: true,
      }
    );
    expect(c).toBe(1);
  });
});
