import { func } from '../../src/func';
import { object } from '../../src/object';
import { isResolver } from '../../src/resolver';

class MyClass {
  someProperty: string;

  constructor() {
    this.someProperty = 'test';
  }

  someMethod() {
    return 'some method called';
  }
}

describe('IsResolver', () => {
  describe('Class', () => {
    it('will identify if the objectClass is a resolver', () => {
      const objClass = object(MyClass);
      expect(isResolver(objClass)).toBe(true);
    });

    it('will identify if a class is not using a resolver', () => {
      const instance = new MyClass();
      expect(isResolver(instance)).toBe(false);
    });
  });

  describe('Function', () => {
    it('will identify if the func is a resolver', () => {
      const exampleFunc = (a: number, b: number) => a + b;
      const LazyExampleFunc = func(exampleFunc, [1, 1]);
      expect(isResolver(LazyExampleFunc)).toBe(true);
    });

    it('will identify as false if the func is not a resolver', () => {
      const exampleFunc = (a: number, b: number) => a + b;
      const LazyExampleFunc = exampleFunc;
      expect(isResolver(LazyExampleFunc)).toBe(false);
      expect(isResolver(() => {})).toBe(false);
    });
  });
});
