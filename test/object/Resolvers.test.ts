import { object } from '../../src/object';
import { func } from '../../src/func';
import { resolver } from '../../src/resolver';

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
  describe('class', () => {
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

  describe('function', () => {
    it('should lazily call a function with provided arguments', () => {
      const add = (a: number, b: number) => a + b;
      const LazyAdd = func(add, [2, 3]);
      const result = LazyAdd.invoke();
      expect(result).toBe(5);
    });

    it('should store and return the provided arguments', () => {
      const multiply = (a: number, b: number) => a * b;
      const LazyMultiply = func(multiply, [4, 5]);
      const args = LazyMultiply.getArgs();
      expect(args).toEqual([4, 5]);
    });

    it('shows error on invalid amount of args', () => {
      const multiply = (a: number, b: number) => a * b;
      // @ts-expect-error
      func(multiply, [4]);
      const multiplyTwo = (a: number, b?: number) => a * (b ?? 1);
      const LazyMultiplyTwo = func(multiplyTwo, [4]);
      const ans = LazyMultiplyTwo.invoke();
      expect(ans).toEqual(4);
    });

    it('works for functions with no arguments', () => {
      const test = () => 'test';
      expect(func(test).invoke()).toEqual('test');
    });
  });
});
