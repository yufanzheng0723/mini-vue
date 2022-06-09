import { ITERATR_KEY, shouldTrack } from "./";
// 储存副作用函数
let activeEffect;

//  模拟储存effect 栈
let effectStack = [];

export function getEffectStack() {
  return effectStack;
}
// 副作用函数
export function effect(fn, options = {} as any) {
  const effectFn = () => {
    cleanup(effectFn);
    activeEffect = effectFn;
    // 调用副作用函数之前将当前副作用函数入栈
    effectStack.push(effectFn);
    // 储存结果
    const res = fn();
    // 在当前副作用函数执行完毕后，将当前副作用函数弹出栈，并把全局副作用函数还原成之前的值
    effectStack.pop();
    activeEffect = effectStack[effectStack.length - 1];
    return res;
  };
  // 将调度器挂载到副作用函数上
  effectFn.options = options;
  // 储存所有与该副作用函数相关的依赖集合
  effectFn.deps = [];
  // 非懒加载时立即执行
  if (!options.lazy) {
    effectFn();
  }
  return effectFn;
}

// 避免副作用函数产生遗留
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.length; i++) {
    // deps是依赖集合
    const deps = effectFn[i];
    deps.delete(effectFn);
  }
  // 重置数组
  effectFn.deps.length = 0;
}

let bucket = new WeakMap();
export function track(target, key) {
  if (!activeEffect || !shouldTrack) return;
  // 根据target从桶中取到depsMap
  let depsMap = bucket.get(target);
  // 如果不存在，就创建一个Map并与target关联
  if (!depsMap) {
    bucket.set(target, (depsMap = new Map()));
  }
  // 根据key从depsMap中取到deps，他是一个set数据类型
  // 里面储存所有与当前key相关联的副作用函数
  let deps = depsMap.get(key);
  // 如果deps不存在，就创建一个set并与key关联
  if (!deps) {
    depsMap.set(key, (deps = new Set()));
  }
  // 最后将当前副作用函数添加到deps中
  deps.add(activeEffect);
  // deps就是一个与当前副作用函数存在联系的依赖集合
  activeEffect.deps.push(deps);
}

export function trigger(target, key, type?: any, newValue?: any) {
  // 根据target从桶中取到depsMap， key对应着副作用函数
  const depsMap = bucket.get(target);
  if (!depsMap) return;
  // 根据key取出所有副作用函数
  const effects = depsMap.get(key);

  const run = new Set();
  effects &&
    effects.forEach((fn) => {
      // 如果执行的副作用函数与当前正在执行的副作用函数相同，就不触发执行
      if (fn !== activeEffect) {
        run.add(fn);
      }
    });
  // 只有添加属性或者删除才触发
  if (type === "ADD" || type === "DELETE") {
    // 取得与 ITERATR_KEY 相关联的副作用函数添加到运行队列中
    const iterateEffects = depsMap.get(ITERATR_KEY);
    iterateEffects &&
      iterateEffects.forEach((fn) => {
        if (fn !== activeEffect) {
          run.add(fn);
        }
      });
  }

  if (type === "ADD" && Array.isArray(target)) {
    // 取出与 length 相关联的副作用函数添加到运行队列中
    const lengthEffects = depsMap.get("length");
    lengthEffects &&
      lengthEffects.forEach((fn) => {
        if (fn !== activeEffect) {
          run.add(fn);
        }
      });
  }

  // 如果操作目标为数组，并且修改了数组的length属性
  if (Array.isArray(target) && key === "length") {
    depsMap.forEach((effects, key) => {
      if (key >= newValue) {
        effects.forEach((fn) => {
          if (fn !== activeEffect) {
            run.add(fn);
          }
        });
      }
    });
  }

  run.forEach((fn: any) => {
    // 如果存在调度器，则调用调度器
    if (fn.options.scheduler) {
      fn.options.scheduler(fn);
    } else {
      fn();
    }
  });
}
