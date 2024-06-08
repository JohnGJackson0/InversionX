import * as E from 'fp-ts/Either';
import { object } from '../../src/resolvers';
import { Container } from '../../src/container';
import { ObjectClass } from '../../src/resolvers/object';

describe('Container - Lazy Init', () => {
  test('object function is a lazy initilizer of the class', () => {
    class TestService {
      constructor() {
        throw 'constructing now....';
      }
      public getValue(): string {
        return 'Hello, Injectofy!';
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, []>;
    }

    const initialServices = {
      TestService: {
        implementation: object(TestService),
      },
    };
    Container.createContainer<AppServices>(initialServices);
    expect(true).toEqual(true);
  });

  test('use function will call constructor of objectClass', () => {
    class TestService {
      constructor() {
        throw new Error('constructing now....');
      }
      public getValue(): string {
        return 'Hello, Injectofy!';
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, []>;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        try {
          val.use('TestService');
          expect(true).toEqual(false);
        } catch (e: unknown) {
          if (e instanceof Error) {
            expect(e?.message).toEqual('constructing now....');
          } else {
            throw `thrown is not an instance of error: ${e}`;
          }
        }
      }
    )(container);
  });

  test('use function will unpack objectClass functions', () => {
    class TestService {
      public getValue(): string {
        return 'Hello, Injectofy!';
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, []>;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        try {
          const testService = val.use('TestService');
          if (E.isRight(testService)) {
            expect(testService.right.getValue()).toEqual('Hello, Injectofy!');
          } else {
            throw 'Fail the test';
          }
        } catch (e: unknown) {
          throw 'Fail the test';
        }
      }
    )(container);
  });

  test('use object wrapper types work', () => {
    class TestService {
      public getValue(): string {
        return 'Hello, Injectofy!';
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, []>;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        try {
          const test = val.use('TestService');

          if (E.isRight(test)) {
            expect(test.right).toBeInstanceOf(TestService);
          } else {
            throw 'fail the test';
          }
        } catch (e: unknown) {
          throw 'Fail the test';
        }
      }
    )(container);
  });

  test('constructors params work', () => {
    class TestService {
      something: string = '';
      constructor(something: string) {
        this.something = something;
      }

      public getValue(): string {
        return `${this.something}`;
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, [string]>;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService).construct('SOMETHING'),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        try {
          const test = val.use('TestService');

          if (E.isRight(test)) {
            expect(test.right).toBeInstanceOf(TestService);
            expect(test.right.getValue()).toEqual('SOMETHING');
          } else {
            throw `fail the test ${test.left.message}`;
          }
        } catch (e: unknown) {
          throw 'Fail the test';
        }
      }
    )(container);
  });

  test('no lazy construct with parameters provided', () => {
    interface Test {
      anotherSomething: string;
    }

    class TestService {
      something: string = '';
      test: Test;
      constructor(something: string, test: Test) {
        this.something = something;
        this.test = test;
      }
      public getValue(): string {
        return `${this.something}${this.test.anotherSomething}`;
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, [string, Test]>;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        expect(e.message).toEqual(
          'There is a required parameter and it was not constructed! Use the object(class).contruct(...)'
        );
      },
      (container: Container<AppServices>) => {
        console.log('container', container);
        throw `Fail the test`;
      }
    )(container);
  });

  test('mismatched lazy construct with parameters provided', () => {
    interface Test {
      anotherSomething: string;
    }

    class TestService {
      something: string = '';
      test: Test;
      constructor(something: string, test: Test) {
        this.something = something;
        this.test = test;
      }
      public getValue(): string {
        return `${this.something}${this.test.anotherSomething}`;
      }
    }
    interface AppServices {
      TestService: ObjectClass<TestService, [string, Test]>;
    }
    const initialServices = {
      TestService: {
        /**
         * This should be sufficient since it's equivalent to the new TestService constructor parameters.
         * Essentially, we need to verify that the generic type array is provided,
         * or that lazy construction is always invoked, even without parameters.
         */
        // @ts-expect-error
        implementation: object(TestService).construct(''),
      },
    };
    const container = Container.createContainer<AppServices>(initialServices);
    E.fold(
      (e: Error) => {
        expect(e.message).toEqual(
          'There is a missing required parameter! Either Adjust the required parameters or correct the construction of the class.'
        );
      },
      (container: Container<AppServices>) => {
        console.log('container', container);
        throw `Fail the test`;
      }
    )(container);
  });
});
