type ClassType<T> = { new (...args: any[]): T };
type FunctionType<T> = (() => T) | ((...args: any[]) => T);
type ValueType<T> = T;
type Resolvers<T = any> = ClassType<T> | FunctionType<T> | ValueType<T>;

type ObjectClass<T, A extends any[]> = {
  new (...args: A): T;
  isUsingObject(): boolean;
  getArgs(): A;
  lazyConstruct(...args: A): ObjectClass<T, A>;
};

export function object<T extends object, A extends any[]>(
  ClassName: new (...args: A) => T
): ObjectClass<T, A> {
  class WrappedClass {
    static argsKey: A;
    static isUsingObject(): boolean {
      return true;
    }
    static getArgs(): A {
      return this.argsKey;
    }
    static lazyConstruct(...args: A): ObjectClass<T, A> {
      this.argsKey = args;
      return WrappedClass as unknown as ObjectClass<T, A>;
    }
    constructor(...args: A) {
      const instance = new ClassName(...args);
      Object.assign(this, instance);
      return instance;
    }
  }
  Object.setPrototypeOf(WrappedClass.prototype, ClassName.prototype);
  return WrappedClass as unknown as ObjectClass<T, A>;
}

export function isResolver(input: Resolvers): boolean {
  return isClassResolver(input);
}

function isClassResolver(input: Resolvers): boolean {
  return (
    typeof input === 'function' &&
    input.prototype &&
    input.prototype.constructor &&
    input?.isUsingObject() === true
  );
}

export function resolver<T>(input: Resolvers): T {
  const args = input?.getArgs && input.getArgs();
  if (isClassResolver(input) && !!args && args?.length > 0) {
    return new (input as ClassType<T>)(...args);
  }
  if (isClassResolver(input)) {
    return new (input as ClassType<T>)();
  }
  return input as T;
}
