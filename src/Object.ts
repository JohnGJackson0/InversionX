type ClassConstructor<T> = new (...args: any[]) => T;
type Resolvers<T = any> = { new (...args: any[]): T } | (() => T) | T;

interface ObjectClass<T> extends ClassConstructor<T> {
  isUsingObject: () => boolean;
}

export function object<T>(ClassName: ClassConstructor<T>): ObjectClass<T> {
  // @ts-ignore
  const WrappedClass = class extends ClassName {
    static isUsingObject() {
      return true;
    }
  };

  return WrappedClass as ObjectClass<T>;
}

export function isResolver(input: Resolvers): boolean {
  return (
    typeof input === 'function' &&
    input.prototype &&
    input.prototype.constructor &&
    input.isUsingObject() === true
  );
}

export function resolver<T>(input: Resolvers): T {
  if (isResolver(input)) {
    return new (input as { new (...args: any[]): T })();
  }
  return input as T;
}
