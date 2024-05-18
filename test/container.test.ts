import { Container } from '../src/container';

class TestService {
  public getValue(): string {
    return 'Hello, Injectofy!';
  }
}

class AnotherService {
  public getValue(): string {
    return 'Hello, Override!';
  }
}

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  test('should register and resolve a service using string identifier', () => {
    container.register('TestService', new TestService());
    const service = container.resolve<TestService>('TestService');
    expect(service).toBeInstanceOf(TestService);
    expect(service.getValue()).toBe('Hello, Injectofy!');
  });

  test('should throw an error if the service is not registered', () => {
    expect(() => container.resolve('TestService')).toThrow(
      'Service not found for identifier: TestService'
    );
  });

  test('should override an existing service registration', () => {
    container.register('TestService', new TestService());
    container.register('TestService', new AnotherService());

    const service = container.resolve<AnotherService>('TestService');
    expect(service.getValue()).toBe('Hello, Override!');
  });
});
