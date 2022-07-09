let activeEffect = undefined
class ReactiveEffct {
  // 默认effect是激活状态
  public active = true
  public parent = null
  // 给 effect 记录依赖，方便分支切换
  public deps = []
  constructor(public fn, public scheduler) {}
  // 执行副作用函数
  run() {
    // 如果非激活，只需要执行一次，不需要依赖收集
    if (!this.active) {
      this.fn()
    }

    try {
      // 记录当前 effect 的父级
      this.parent = activeEffect
      activeEffect = this
      // 每次执行前把之前收集的副作用函数清空
      cleanupEffect(this)
      return this.fn()
    } finally {
      activeEffect = this.parent
    }
  }
  stop() {
    if (this.active) {
      this.active = false
      cleanupEffect(this)
    }
  }
}

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffct(fn, options.scheduler)
  // 默认先执行一次
  _effect.run()
  // 绑定this
  const runner = _effect.run.bind(_effect)

  runner.effect = _effect
  return runner
}

const targetMap = new WeakMap()
export function track(target, type, key) {
  if (!activeEffect) return
  // 第一次查找有没有
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  // 检测是否存在这个副作用函数，如果不存在就添加进去
  let shouldTrack = !dep.has(activeEffect)
  if (shouldTrack) {
    dep.add(activeEffect)
    // 让 effect 记录住对应的依赖
    activeEffect.deps.push(dep)
  }
}

export function trigger(target, type, key, newValue, oldValue) {
  // 触发的值是否在副作用函数中使用
  const depsMap = targetMap.get(target)
  if (!depsMap) return

  // 找到对应的 effect 并执行
  let effects = depsMap.get(key)
  if (effects) {
    effects = new Set(effects)
    effects.forEach((effect) => {
      if (effect !== activeEffect) {
        // 如果存在调度器就只执行调度器
        if (effect.scheduler) {
          effect.scheduler()
        } else {
          effect.run()
        }
      }
    })
  }
}

// 清理之前的副作用函数
function cleanupEffect(effect) {
  const { deps } = effect
  for (let i = 0; i < deps.length; i++) {
    // 解除依赖，重新收集依赖
    deps[i].delete(effect)
  }
  effect.deps.length = 0
}
