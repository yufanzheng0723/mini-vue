import { effect } from "./effect";

interface WatchOptions {
  immediate?: boolean;
  // pre 回调函数在watch创建时立即执行一次；
  // post 代表调度行数需要将副作用函数放到一个微任务队列中执行，并等待DOM更新结束后在执行;
  flush?: "pre" | "post" | "sync";
}

export function watch(obj, cb, options: WatchOptions) {
  let getter;
  // 如果传入的是一个函数，那就直接使用要监听的值，如果是一个对象，那就递归遍历需要监听的值
  if (typeof obj === "function") {
    getter = obj;
  } else {
    getter = () => traverse(obj);
  }
  let oldValue: any, newValue: any;

  const job = () => {
    // 在调度器中重新执行副作用函数，得到新值
    newValue = effectFn();
    // 将新旧值作为回调的参数
    cb(newValue, oldValue, onInvalidate);
    // 更新旧值
    oldValue = newValue;
  };

  // 用来储存用户的过期回调
  let cleanup;
  function onInvalidate(fn) {
    // 将过期回调储存起来
    cleanup = fn;
  }

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      // 当flush为post时，将其放入微任务队列中执行，否则立即执行
      if (options.flush === "post") {
        const p = Promise.resolve();
        p.then(job);
      } else {
        job();
      }
    },
  });
  // 手动调用副作用函数，拿到旧值
  if (options.immediate) {
    job();
  } else {
    oldValue = effectFn();
  }
}

// 递归遍历
function traverse(value, seen = new Set()) {
  // 如果读取的数据是原始值或者已经被读取过了，就什么都不做
  if (typeof value !== "object" || value === null || seen.has(value)) return;
  // 添加进去，表示已经读取过了
  seen.add(value);
  // 递归遍历
  for (const k in value) {
    traverse(value[k], seen);
  }
  return value;
}
