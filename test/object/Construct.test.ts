import { object, resolver } from '../../src/object';

describe('Constructor', () => {
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

  it('will throw when resolving without constructing when there is paramters', () => {
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
    let throws = false;
    try {
      resolver(classInstance);
    } catch (e: unknown) {
      throws = true;
      if (e instanceof Error) {
        expect(e.message).toEqual(
          'There is a required parameter and it was not constructed! Use the object(class).contruct(...)'
        );
      } else {
        throw 'Fail the test';
      }
    }
    expect(throws).toEqual(true);
  });

  it('works with javascript', () => {
    class MyClass {
      // @ts-ignore
      someProperty;
      // @ts-ignore
      constructor(test) {
        this.someProperty = test;
      }
      someMethod() {
        return `some method called ${this.someProperty}`;
      }
    }
    const classInstance = object(MyClass);
    let throws = false;
    try {
      resolver(classInstance);
    } catch (e: unknown) {
      throws = true;
      if (e instanceof Error) {
        expect(e.message).toEqual(
          'There is a required parameter and it was not constructed! Use the object(class).contruct(...)'
        );
      } else {
        throw 'Fail the test';
      }
    }
    expect(throws).toEqual(true);
  });
  it('will not throw with no constructor javascript', () => {
    class MyClass {
      // @ts-ignore
      someProperty;
      someMethod() {
        return `some method called ${this.someProperty}`;
      }
    }
    const classInstance = object(MyClass);
    let throws = false;
    try {
      resolver(classInstance);
    } catch (e: unknown) {
      throws = true;
    }
    expect(throws).toEqual(false);
  });
});
