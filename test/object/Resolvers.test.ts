import { object, resolver } from '../../src/object';

class MyClass {
  someProperty: string;

  constructor() {
    this.someProperty = 'test';
  }

  someMethod() {
    return 'some method called';
  }
}

describe('Resolvers', () => {
  test('generic is not correct', () => {
    const resolvedVal = resolver<MyClass>('21');
    expect(typeof resolvedVal).toBe('string');
    expect(resolvedVal).toEqual('21');
  });

  test('should resolve a value back to the original value', () => {
    const resolvedVal = resolver<string>('21');
    expect(typeof resolvedVal).toBe('string');
    expect(resolvedVal).toEqual('21');
  });

  test('should resolve a function back to the original function', () => {
    const func = () => {
      return '123';
    };
    const resolvedVal = resolver<() => string>(func);
    expect(resolvedVal()).toEqual('123');
  });

  test('should resolve to the same when not using the object wrapper', () => {
    const classInstance = new MyClass();
    const instance = resolver<MyClass>(classInstance);
    expect(instance).toBeInstanceOf(MyClass);
    expect(instance.someMethod()).toEqual('some method called');
  });

  test('when using the wrapper it will create the instance directly', () => {
    const classInstance = object(MyClass);
    expect(classInstance).not.toBeInstanceOf(MyClass);
    const instance = resolver<MyClass>(classInstance);
    expect(instance).toBeInstanceOf(MyClass);
    expect(instance.someMethod()).toEqual('some method called');
  });

  test('if not a class it will throw ts error', () => {
    try {
      // @ts-expect-error
      object({ any: 'test' });
      // @ts-expect-error
      object(() => {});
    } catch (e: unknown) {}
  });
});
