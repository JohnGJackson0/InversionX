import { iocContainer } from '../../src/Example/container';
import { TestService } from '../../src/Example/services/TestService';

describe('container', () => {
  describe('smoke tests', () => {
    it('works with USE classes', () => {
      expect(iocContainer.useService('TestService').getValue()).toEqual('TEST');
    });

    it('works with non USE Classes', () => {
      expect(iocContainer.useService('TestService2').getValue()).toEqual(
        'TEST 2'
      );
    });

    it('works with non func() functions', () => {
      expect(iocContainer.useService('TestService3')()).toEqual('TEST 3');
    });

    it('works for func() functions', () => {
      expect(iocContainer.useService('TestService4').invoke()).toEqual(2);
    });
  });

  describe('typescript tests', () => {
    it('works with USE classes', () => {
      expect(iocContainer.useService('TestService')).toBeInstanceOf(
        TestService
      );
    });

    it('works with non USE Classes', () => {
      expect(iocContainer.useService('TestService2')).toBeInstanceOf(
        TestService
      );
    });

    it('works with non func() functions', () => {
      const test: () => string = iocContainer.useService('TestService3');
      expect(typeof test).toEqual('function');
      expect(typeof test()).toEqual('string');
    });

    it('works for func() functions', () => {
      /** TODO Func implementation is incomplete */
      expect(iocContainer.useService('TestService4').invoke()).toEqual(2);
    });
  });
});
