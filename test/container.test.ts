import { Container } from '../src/container';

class TestService {
  public getValue(): string {
    return 'Hello, Injectofy!';
  }
}

describe('Container', () => {
  let container: Container;

  beforeEach(() => {
    container = new Container();
  });

  it('should register and resolve a service', () => {
    container.register(TestService, new TestService());
    const service = container.resolve(TestService);
    expect(service).toBeInstanceOf(TestService);
    expect(service.getValue()).toBe('Hello, Injectofy!');
  });

  it('should throw an error if the service is not registered', () => {
    expect(() => container.resolve(TestService)).toThrow(
      'Service not found for identifier: function TestService()'
    );
  });

  it('should override an existing service registration', () => {
    class AnotherService {
      public getValue(): string {
        return 'Hello, Override!';
      }
    }

    container.register(TestService, new TestService());
    container.register(TestService, new AnotherService() as any);

    const service = container.resolve(TestService);
    expect(service.getValue()).toBe('Hello, Override!');
  });
});
