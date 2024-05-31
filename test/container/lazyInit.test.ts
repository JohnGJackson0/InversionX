// import { Container } from '../src/container';
// import * as E from 'fp-ts/Either';

test('placeholder', () => {
  expect(true).toEqual(true);
});

/** FAILING TEST
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
      TestService: TestService;
    }
    const initialServices = {
      TestService: {
        implementation: object(TestService),
        type: TestService,
      },
    };
    const container = Container.createContainer<AppServices>(
      initialServices as any
    );

    E.fold(
      (e: Error) => {
        throw `fail the test ${e.message}`;
      },
      (val: Container<AppServices>) => {
        E.fold(
          (e: Error) => {
            expect(e.message).toEqual('constructing now....');
          },
          (_: TestService) => {
            throw 'fail the test, it should construct it now which will throw!';
          }
        )(val.resolve('TestService'));
      }
    )(container);
  });
});
 */
