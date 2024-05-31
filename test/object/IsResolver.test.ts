import { isResolver, object } from '../../src/object';

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
});
