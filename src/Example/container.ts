import { Container } from '../container';
import { func } from '../resolvers';
import { FuncClass } from '../resolvers/func';
import { ObjectClass, object } from '../resolvers/object';
import { TestService } from './services/TestService';
import * as E from 'fp-ts/Either';

interface AppServices {
  TestService: ObjectClass<TestService, [string]>;
  TestService2: TestService;
  TestService3: () => string;
  TestService4: FuncClass<[a: number, b: number], number>;
}

const initialServices = {
  TestService: {
    implementation: object(TestService).construct('TEST'),
  },
  TestService2: {
    implementation: new TestService('TEST 2'),
  },
  TestService3: {
    implementation: () => {
      return 'TEST 3';
    },
  },
  TestService4: {
    implementation: func((a: number, b: number) => a + b, [1, 1]),
  },
};

function _container() {
  const iocContainer = Container.createContainer<AppServices>(initialServices);
  if (E.isLeft(iocContainer)) {
    // handle errors at highest level, rethrow, or E.left, your choice...
    throw new Error(iocContainer.left.message);
  }
  const container = iocContainer.right;
  function useService<T extends keyof AppServices>(num: T) {
    const service = container.use(num);
    if (E.isLeft(service)) {
      // handle errors at highest level, rethrow, or E.left, your choice...
      throw new Error(service.left.message);
    }
    return service.right;
  }
  return { useService };
}

export const iocContainer = _container();
