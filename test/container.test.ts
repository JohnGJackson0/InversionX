import { Container } from '../src/container';

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
    container = new Container<AppServices>();
  });

  test('should register and resolve TestService', () => {
    container.register('TestService', new TestService(), TestService);
    const service = container.resolve('TestService');
    expect(service).toBeInstanceOf(TestService);
    expect(service.getValue()).toBe('Hello, Injectofy!');
  });

  test('should register and resolve AnotherService', () => {
    container.register('AnotherService', new AnotherService(), AnotherService);
    const service = container.resolve('AnotherService');
    expect(service).toBeInstanceOf(AnotherService);
    expect(service.getValue()).toBe('Hello, Override!');
  });

  test('should throw an error if the service is not registered', () => {
    expect(() => container.resolve('TestService')).toThrow(
      'Service not found for identifier: TestService'
    );
  });

  test('should override an existing service with the same type', () => {
    container.register('TestService', new TestService(), TestService);
    container.register('TestService', new TestService(), TestService);

    const service = container.resolve('TestService');
    expect(service.getValue()).toBe('Hello, Injectofy!');
  });

  test('should throw an error if attempting to override with a different type', () => {
    container.register('TestService', new TestService(), TestService);
    expect(() =>
      container.register('TestService', new AnotherService(), AnotherService)
    ).toThrow(
      'Type mismatch: TestService is already registered with a different type'
    );
  });

  test('should throw an error if resolving an unregistered service', () => {
    expect(() => container.resolve('AnotherService')).toThrow(
      'Service not found for identifier: AnotherService'
    );
  });

  test('should infer the type based on the container', () => {
    container.register('TestService', new TestService(), TestService);
    const service = container.resolve('TestService');

    // TypeScript type assertion to ensure 'service' is of type TestService
    const inferredType: TestService = service;
    expect(inferredType).toBeInstanceOf(TestService);
    expect(inferredType.getValue()).toBe('Hello, Injectofy!');
  });
});
