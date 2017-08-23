import expect, { createSpy } from 'expect'
import delay from './delay'
import createTransitionManager from '../createTransitionManager'

describe('transition manager', () => {
  let manager
  beforeEach(() => {
    manager = createTransitionManager()
  })

  it('notifies all of its listeners functions registered with "after" when "transition" is called', () => {
    const fn1 = createSpy()
    const fn2 = createSpy()
    const arg1 = 'foo'
    const arg2 = 'bar'
    ;[fn1, fn2].forEach(fn => manager.appendListener(fn))
    manager.notifyListeners(arg1, arg2)
    ;[fn1, fn2].forEach(fn => expect(fn).toHaveBeenCalledWith(arg1, arg2))
  })

  it('iterates through the pre-transition listeners registered with "before" when "confirmTransitionTo" is called', async () => {
    const fn1 = createSpy()
    const fn2 = createSpy()
    const arg1 = 'foo'
    const arg2 = 'bar'
    ;[fn1, fn2].forEach(fn => manager.before(fn))
    const res = await manager.confirmTransitionTo(arg1, arg2)
    expect(res).toBe(true)
    ;[fn1, fn2].forEach(fn => expect(fn).toHaveBeenCalledWith(arg1, arg2))
  })

  it('returns false from the async "confirmTransitionTo" function if any of the async pre-listeners return a truthy value', async () => {
    const fn1 = createSpy()
    let fn2 = createSpy(async () => {
      await delay(2)
      return true
    }).andCallThrough()
    const fn3 = createSpy();
    [fn1, fn2, fn3].forEach(fn => manager.before(fn))
    const res = await manager.confirmTransitionTo()
    expect(res).toBe(false)
    expect(fn1).toHaveBeenCalled()
    expect(fn2).toHaveBeenCalled()
    expect(fn3).toNotHaveBeenCalled()
  })

  it('returns an idempotent unsubscribe function when registering before listeners', async () => {
    const fn1 = createSpy()
    const unsub = manager.before(fn1)
    await manager.confirmTransitionTo()
    expect(fn1).toHaveBeenCalled()
    unsub(); unsub(); unsub()
    await manager.confirmTransitionTo()
    expect(fn1.calls.length).toBe(1)
  })

  it('returns an idempotent unsubscribe function when registering after listeners', () => {
    const fn1 = createSpy()
    const unsub = manager.appendListener(fn1)
    manager.notifyListeners()
    expect(fn1).toHaveBeenCalled()
    unsub(); unsub(); unsub()
    manager.notifyListeners()
    expect(fn1.calls.length).toBe(1)
  })

  it('unsubscribes multiple pre-hooks in one call if a function has been registered more than once', () => {
    const beforeHook = createSpy()
    const unsubBefore = manager.before(beforeHook)
    manager.before(beforeHook)
    unsubBefore()
    manager.notifyListeners()
    expect(beforeHook).toNotHaveBeenCalled()
  })

  it('has unique unsubscribe functions for appendListener', () => {
    const afterHook = createSpy()
    const unsubAfter = manager.appendListener(afterHook)
    manager.appendListener(afterHook)
    manager.appendListener(afterHook)
    unsubAfter()
    manager.notifyListeners()
    expect(afterHook).toHaveBeenCalled()
  })
})
