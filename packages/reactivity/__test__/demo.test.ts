import { describe, it, expect } from "vitest";

function add(a, b) {
  return a + b;
}

describe("学习", () => {
  it("测试add函数", () => {
    expect(add(1, 2)).toBe(3);
  });
});
