import { Container } from '../../src/container';
import * as E from 'fp-ts/Either';

class TestService {
  getName() {
    return 'TestService';
  }
}

class AnotherService {
  getDescription() {
    return 'AnotherService';
  }
}

describe('Container use function', () => {
  let container: Container<{
    testService: TestService;
    anotherService: AnotherService;
  }>;

  beforeEach(() => {
    const initialServices = {
      testService: { implementation: new TestService(), type: TestService },
      anotherService: {
        implementation: new AnotherService(),
        type: AnotherService,
      },
    };
    const result = Container.createContainer(initialServices);
    if (E.isRight(result)) {
      container = result.right;
    } else {
      throw result.left;
    }
  });

  test('should use a registered service', () => {
    const service = container.use('testService');
    expect(service).toBeInstanceOf(TestService);
    expect(service.getName()).toBe('TestService');
  });

  test('should throw an error if service is not registered', () => {
    expect(() => container.use('nonExistentService' as any)).toThrow(
      'Service not found for identifier: nonExistentService'
    );
  });

  test('should use another registered service', () => {
    const anotherService = container.use('anotherService');
    expect(anotherService).toBeInstanceOf(AnotherService);
    expect(anotherService.getDescription()).toBe('AnotherService');
  });

  test('should use services after additional registration', () => {
    class AdditionalService {
      getInfo() {
        return 'AdditionalService';
      }
    }

    const additionalService = new AdditionalService();
    container.register('additionalService' as any, additionalService);

    const usedService = container.use('additionalService' as any);
    expect(usedService).toBeInstanceOf(AdditionalService);
    expect(usedService.getInfo()).toBe('AdditionalService');
  });

  test('should handle service resolution failure gracefully', () => {
    const resolveSpy = jest.spyOn(container, 'resolve');
    resolveSpy.mockReturnValueOnce(
      E.left(new Error('Simulated resolve error'))
    );
    expect(() => container.use('testService')).toThrow(
      'Simulated resolve error'
    );
    resolveSpy.mockRestore();
  });
});
