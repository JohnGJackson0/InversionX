// ObjectWrapper.test.ts

import { object, isUsingObjectWrapper, resolver } from '../src/Object';

// Sample class to test with
class MyClass {
  someProperty: string;

  constructor() {
    this.someProperty = 'test';
  }

  someMethod() {
    return 'some method called';
  }
}

describe('ObjectWrapper', () => {
  test('should add isUsingObject method to the instance', () => {
    const instance = object(MyClass);
    expect(isUsingObjectWrapper(instance)).toBe(true);
  });

  test('should be false if isUsingObjectWrapper not using object wrapper', () => {
    const instance = new MyClass();
    expect(isUsingObjectWrapper(instance)).toBe(false);
  });

  test('instance created directly should not have isUsingObject method', () => {
    const instance2 = new MyClass();
    expect(isUsingObjectWrapper(instance2)).toBe(false);
  });

  describe('resolver', () => {
    test('generic is not correct', () => {
      const resolvedVal = resolver<MyClass>('21');
      expect(typeof resolvedVal).toBe('string');
      // @ts-ignore
      expect(resolvedVal).toEqual('21');
    });

    test('should resolve a value back to the original value', () => {
      const resolvedVal = resolver<string>('21');
      expect(typeof resolvedVal).toBe('string');
      // @ts-ignore
      expect(resolvedVal).toEqual('21');
    });

    /* FAILING TEST
    test('should resolve a function back to the original function', () => {
      const func = () => {
        return '123';
      };
      const resolvedVal = resolver<() => string>(func);
      expect(resolvedVal()).toEqual('123');
    });*/

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
      // @ts-expect-error
      object({ any: 'test' });
      // @ts-expect-error
      object(() => {});
    });
  });

  describe('constructor args', () => {
    it('will accept with any constructor argument', () => {
      class MyClass {
        someProperty: string;

        constructor(test: string) {
          this.someProperty = test;
        }

        someMethod() {
          return 'some method called';
        }
      }
      const classInstance = object(MyClass);
      const instance = resolver<MyClass>(classInstance);
      expect(instance).toBeInstanceOf(MyClass);
    });
  });
});
