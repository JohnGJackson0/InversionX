type ClassConstructor<T> = new (...args: any[]) => T;
type ClassType<T> = { new (...args: any[]): T };
type FunctionType<T> = (() => T) | ((...args: any[]) => T);
type ValueType<T> = T;
type Resolvers<T = any> = ClassType<T> | FunctionType<T> | ValueType<T>;

interface ObjectClass<T> extends ClassConstructor<T> {
  construct(...args: any[]): ObjectClass<T>;
  isUsingObject: () => boolean;
}

export function object<T extends object>(
  ClassName: ClassConstructor<T>
): ObjectClass<T> {
  class WrappedClass {
    static argsKey: any[];
    static isUsingObject(): boolean {
      return true;
    }
    static getArgs() {
      return this.argsKey;
    }
    static construct(...args: any[]): WrappedClass {
      this.argsKey = args;
      return WrappedClass as unknown as ObjectClass<T>;
    }
    constructor(...args: any[]) {
      const instance = new ClassName(...args);
      Object.assign(this, instance);
      return instance;
    }
  }
  Object.setPrototypeOf(WrappedClass.prototype, ClassName.prototype);
  return WrappedClass as unknown as ObjectClass<T>;
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
