import * as E from 'fp-ts/Either';
import { object } from '../../src/resolvers';
import { Constructor, Container } from '../../src/container';
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
        // TODO
        type: object(TestService) as unknown as Constructor<
          ObjectClass<TestService, []>
        >,
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
});
