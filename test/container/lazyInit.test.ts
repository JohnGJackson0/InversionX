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
    const container = Container.createContainer<AppServices>(initialServices);

    let reachesResolver = false;
    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        E.fold(
          (e: Error) => {
            expect(e.message).toEqual('constructing now....');
          },
          (_) => {
            reachesResolver = true;
            // throw 'fail the test, it should construct it now which will throw!';
          }
        )(val.resolve('TestService'));
      }
    )(container);

    expect(reachesResolver).toEqual(true);
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
          expect(val.use('TestService').getValue()).toEqual(
            'Hello, Injectofy!'
          );
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
          expect(test).toBeInstanceOf(TestService);
        } catch (e: unknown) {
          throw 'Fail the test';
        }
      }
    )(container);
  });
});
