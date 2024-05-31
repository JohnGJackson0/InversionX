import { object, resolver, isResolver } from '../src/object';
class MyClass {
  someProperty: string;

  constructor() {
    this.someProperty = 'test';
  }

  someMethod() {
    return 'some method called';
  }
}

describe('object', () => {
  test('should add isUsingObject method to the instance', () => {
    const instance = object(MyClass);
    expect(isResolver(instance)).toBe(true);
  });

  test('should be false if isResolver not using object wrapper', () => {
    const instance = new MyClass();
    expect(isResolver(instance)).toBe(false);
  });

  test('instance created directly should not have isUsingObject method', () => {
    const instance2 = new MyClass();
    expect(isResolver(instance2)).toBe(false);
  });

  describe('resolver', () => {
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

  describe('constructor args', () => {
    it('will accept with any constructor argument', () => {
      class MyClass {
        someProperty: string;

        constructor(test: string) {
          this.someProperty = test;
        }

        someMethod() {
          return `some method called ${this.someProperty}`;
        }
      }
      const classInstance = object(MyClass);
      // TODO should fail
      const instance = resolver<MyClass>(classInstance);
      expect(instance).toBeInstanceOf(MyClass);
      expect(instance.someMethod()).toEqual('some method called undefined');
    });

    it('will properly construct with a parameter', () => {
      class MyClass {
        someProperty: string;
        constructor(test: string) {
          this.someProperty = test;
        }
        someMethod() {
          return `some method called ${this.someProperty}`;
        }
      }
      const classInstance = object(MyClass).lazyConstruct('TEST someProperty');
      const resolved = resolver<MyClass>(classInstance);
      expect(resolved.someMethod()).toEqual(
        'some method called TEST someProperty'
      );
    });

    it('is typesafe on lazy constructors', () => {
      class MyClass {
        someProperty: string;
        constructor(test: string) {
          this.someProperty = test;
        }
        someMethod() {
          return `${this.someProperty}`;
        }
      }
      // @ts-expect-error
      object(MyClass).lazyConstruct();
      // @ts-expect-error
      object(MyClass).lazyConstruct(123);
      const resolved = object(MyClass).lazyConstruct('123');
      expect(resolver<MyClass>(resolved).someMethod()).toEqual('123');
    });
  });
});
