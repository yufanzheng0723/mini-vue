import { describe, it, expect } from "vitest";
import { computed, reactive } from "../src";

describe("computed", () => {
  it("测试computed", () => {
    let a: any = reactive({
      a: 1,
    });

    let obj: any = computed(() => a.a + 1);

    expect(obj.value).toBe(2);
    a.a++;
    expect(obj.value).toBe(3);
  });
});
