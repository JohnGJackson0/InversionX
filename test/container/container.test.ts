import * as E from 'fp-ts/Either';
import { Container } from '../../src/container';

export class TestService {
  public getValue(): string {
    return 'Hello, Injectofy!';
  }
}

export class AnotherService {
  public getValue(): string {
    return 'Hello, Override!';
  }
}

export interface AppServices {
  TestService: TestService;
  AnotherService: AnotherService;
}
describe('Container', () => {
  let container: Container<AppServices>;

  beforeEach(() => {
    const containerRes = Container.createContainer<AppServices>();

    if (E.isLeft(containerRes)) {
      throw '';
    }

    container = containerRes.right;
  });

  test('should register and resolve TestService', () => {
    container.register('TestService', new TestService());
    const service = container.use('TestService');

    if (E.isRight(service)) {
      expect(service.right).toBeInstanceOf(TestService);
      expect(service.right.getValue()).toBe('Hello, Injectofy!');
    } else {
      failTheTest();
    }
  });

  const failTheTest = () => expect(true).not.toEqual(true);

  test('should register and resolve AnotherService', () => {
    container.register('AnotherService', new AnotherService());
    const service = container.use('AnotherService');
    if (E.isRight(service)) {
      expect(service.right).toBeInstanceOf(AnotherService);
      expect(service.right.getValue()).toBe('Hello, Override!');
    } else {
      failTheTest();
    }
  });

  test('should result in left/failure if the service is not registered', () => {
    const service = container.use('TestService');

    if (E.isRight(service)) {
      failTheTest();
    } else {
      expect(service.left.message).toEqual(
        'Service not found for identifier: TestService'
      );
    }
  });

  test('should override an existing service with the same type', () => {
    container.register('TestService', new TestService());
    container.register('TestService', new TestService());
    const service = container.use('TestService');
    if (E.isRight(service)) {
      expect(service.right.getValue()).toBe('Hello, Injectofy!');
    } else {
      failTheTest();
    }
  });

  test('should result in left/failure if resolving an unregistered service', () => {
    const service = container.use('AnotherService');
    if (E.isRight(service)) {
      failTheTest();
    } else {
      expect(service.left.message).toEqual(
        'Service not found for identifier: AnotherService'
      );
    }
  });

  test('should infer the type based on the container', () => {
    container.register('TestService', new TestService());
    const service = container.use('TestService');

    if (E.isRight(service)) {
      const inferredType: TestService = service.right;
      expect(inferredType).toBeInstanceOf(TestService);
      expect(inferredType.getValue()).toBe('Hello, Injectofy!');
    } else {
      failTheTest();
    }
  });

  test('will resolve to ducked type class when using register and not already registered', () => {
    class DuckTypedClass {
      public getValue(): string {
        return 'Hello, Duck Typing!';
      }
    }
    container.register('TestService', new DuckTypedClass());
    const service = container.use('TestService');
    if (E.isRight(service)) {
      const inferredType: TestService = service.right;
      expect(inferredType).toBeInstanceOf(DuckTypedClass);
      expect(inferredType.getValue()).toBe('Hello, Duck Typing!');
    } else {
      failTheTest();
    }
  });

  test('will result in left/failure when trying to register service from non duck types', () => {
    const container = Container.createContainer<AppServices>({
      TestService: {
        implementation: new TestService(),
      },
      AnotherService: {
        implementation: new AnotherService(),
      },
    });

    class DuckTypedClass {
      public getValue(): string {
        return 'Hello, Diff!';
      }
    }

    if (E.isLeft(container)) {
      throw '';
    }

    expect(() =>
      container.right.register('TestService', new DuckTypedClass())
    ).not.toThrow(
      'Type mismatch: TestService is already registered with a different type'
    );

    const registerVal = container.right.register(
      'TestService',
      new DuckTypedClass()
    );

    if (E.isLeft(registerVal)) {
      failTheTest();
    }

    const service = container.right.use('TestService');

    if (E.isRight(service)) {
      expect(service.right.getValue()).toEqual('Hello, Diff!');
    } else {
      failTheTest();
    }
  });

  test('functions work in the container', () => {
    interface Services {
      serviceA: () => String;
    }
    const initialServices = {
      serviceA: {
        implementation: () => 'TEST',
      },
    };

    const container = Container.createContainer<Services>(initialServices);

    if (E.isLeft(container)) {
      throw '';
    }

    E.fold(
      (err: Error) => {
        throw `Fail The Test ${err.message}`;
      },
      (val: () => String) => {
        expect(val()).toEqual('TEST');
      }
    )(container.right.use('serviceA'));
  });

  describe('create container', () => {
    interface Services {
      serviceA: ServiceA;
      serviceB: ServiceB;
    }

    class ServiceA {
      constructor(public name: string) {}
    }

    class ServiceB {
      constructor(public value: number) {}
    }

    it('should create a container without initial services', () => {
      const result = Container.createContainer<Services>();
      expect(E.isRight(result)).toBe(true);

      const container = E.getOrElseW(() => null)(result);
      expect(container).not.toBeNull();
      expect(container).toBeInstanceOf(Container);
    });

    it('should update after the register called on create container', () => {
      const initialServices = {
        serviceA: {
          implementation: new ServiceA('test'),
        },
        serviceB: {
          implementation: new ServiceB(42),
        },
      };
      const result = Container.createContainer<Services>(initialServices);
      expect(E.isRight(result)).toBe(true);
      E.fold(
        (_: Error) => {
          failTheTest();
        },
        (val: Container<Services>) => {
          val.register('serviceA', () => new ServiceA(''));
          val.register('serviceA', () => new ServiceB(42));
          val.register('serviceA', new ServiceA('updated'));
          expect(E.getOrElseW(() => null)(val.use('serviceA'))?.name).toEqual(
            'updated'
          );
          expect(E.getOrElseW(() => null)(val.use('serviceA'))).toBeInstanceOf(
            ServiceA
          );
        }
      )(result);
    });

    it('should create a container with initial services', () => {
      const initialServices = {
        serviceA: {
          implementation: new ServiceA('test'),
        },
        serviceB: {
          implementation: new ServiceB(42),
        },
      };

      const result = Container.createContainer<Services>(initialServices);
      expect(E.isRight(result)).toBe(true);

      const container = E.getOrElseW(() => null)(result);
      expect(container).not.toBeNull();
      expect(container).toBeInstanceOf(Container);
    });
  });
});
