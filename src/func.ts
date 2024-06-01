interface FuncClass<A extends any[], R> {
  lazyCall(...args: A): FuncClass<A, R>;
  getArgs(): A;
  isUsingFunc(): boolean;
  invoke(): R;
}

export function func<A extends any[], R>(
  func: (...args: A) => R,
  args: A
): FuncClass<A, R> {
  class WrappedFunction {
    private static argsKey: A = args;
    private static originalFunc = func;
    static getArgs(): A {
      return this.argsKey;
    }
    static isUsingFunc(): boolean {
      return true;
    }
    static invoke(): R {
      if (!this.argsKey) {
        throw new Error('Arguments not provided for the function');
      }
      return this.originalFunc(...this.argsKey);
    }
  }

  return WrappedFunction as unknown as FuncClass<A, R>;
}
