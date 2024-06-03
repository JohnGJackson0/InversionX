import { func } from '../../src/resolvers/func';

describe('Resolver function', () => {
  it('should lazily call a function with provided arguments', () => {
    const add = (a: number, b: number) => a + b;
    const LazyAdd = func(add, [2, 3]);
    const result = LazyAdd.invoke();
    expect(result).toBe(5);
  });

  it('should store and return the provided arguments', () => {
    const multiply = (a: number, b: number) => a * b;
    const LazyMultiply = func(multiply, [4, 5]);
    const args = LazyMultiply.getArgs();
    expect(args).toEqual([4, 5]);
  });

  it('shows error on invalid amount of args', () => {
    const multiply = (a: number, b: number) => a * b;
    // @ts-expect-error
    func(multiply, [4]);
    const multiplyTwo = (a: number, b?: number) => a * (b ?? 1);
    const LazyMultiplyTwo = func(multiplyTwo, [4]);
    const ans = LazyMultiplyTwo.invoke();
    expect(ans).toEqual(4);
  });

  it('works for functions with no arguments', () => {
    const test = () => 'test';
    expect(func(test).invoke()).toEqual('test');
  });
});
