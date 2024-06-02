interface FuncClass<A extends any[], R> {
  lazyCall(...args: A): FuncClass<A, R>;
  getArgs(): A;
  isUsingFunc(): boolean;
  invoke(): R;
}

export function func<A extends any[], R>(
  func: (...args: A) => R,
  args?: A
): FuncClass<A, R> {
  class WrappedFunction {
    private static argsKey: A = args || ([] as unknown as A);
    private static originalFunc = func;
    static lazyCall(...args: A): FuncClass<A, R> {
      this.argsKey = args;
      return this as unknown as FuncClass<A, R>;
    }
    static getArgs(): A {
      return this.argsKey;
    }
    static isUsingFunc(): boolean {
      return true;
    }
    static invoke(): R {
      return this.originalFunc(...this.argsKey);
    }
  }

  return WrappedFunction as unknown as FuncClass<A, R>;
}
