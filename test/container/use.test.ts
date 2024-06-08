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
    if (E.isLeft(service)) {
      throw '';
    }
    expect(service.right).toBeInstanceOf(TestService);
    expect(service.right.getName()).toBe('TestService');
  });

  test('should throw an error if service is not registered', () => {
    const service = container.use('nonExistentService' as any);
    if (E.isRight(service)) {
      throw '';
    }
    expect(service.left.message).toEqual(
      'Service not found for identifier: nonExistentService'
    );
  });

  test('should use another registered service', () => {
    const anotherService = container.use('anotherService');
    if (E.isLeft(anotherService)) {
      throw '';
    }
    expect(anotherService.right).toBeInstanceOf(AnotherService);
    expect(anotherService.right.getDescription()).toBe('AnotherService');
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

    if (E.isLeft(usedService)) {
      throw '';
    }

    expect(usedService.right).toBeInstanceOf(AdditionalService);
    expect(usedService.right.getInfo()).toBe('AdditionalService');
  });
});
