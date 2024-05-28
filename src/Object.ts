export function object<T>(
  ClassName: new (args: any) => T
): { new (): T } & { isUsingObject: () => boolean } {
  return new Proxy(ClassName, {
    construct(target, args, newTarget) {
      const instance = Reflect.construct(target, args, newTarget);
      (instance as any).isUsingObject = () => true;
      return instance;
    },
    get(target, prop, receiver) {
      if (prop === 'isUsingObject') {
        return () => true;
      }
      return Reflect.get(target, prop, receiver);
    },
  }) as unknown as { new (): T } & { isUsingObject: () => boolean };
}

export function isUsingObjectWrapper(
  instance: any
): instance is { isUsingObject: () => boolean } {
  return typeof instance?.isUsingObject === 'function';
}
/*
function isFunctionButNotClass(value: any): boolean {
  return (
    typeof value === 'function' &&
    !/^class\s/.test(Function.prototype.toString.call(value))
  );
}*/

export function resolver<T>(ClassOrInstance: any): T {
  if (typeof ClassOrInstance === 'function') {
    const wrappedClass = object(ClassOrInstance);

    // if (isFunctionButNotClass(ClassOrInstance)) {
    //  return ClassOrInstance as T;
    // }

    if (isUsingObjectWrapper(wrappedClass.prototype)) {
      return new wrappedClass() as T;
    } else {
      return new ClassOrInstance() as T;
    }
  } else {
    return ClassOrInstance as T;
  }
}
