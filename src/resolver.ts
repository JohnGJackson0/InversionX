type ClassType<T> = { new (...args: any[]): T };
type FunctionType<T> = (() => T) | ((...args: any[]) => T);
type ValueType<T> = T;
type Resolvers<T = any> = ClassType<T> | FunctionType<T> | ValueType<T>;

export function isResolver(input: Resolvers): boolean {
  return isClassResolver(input) || isFuncResolver(input);
}
function isFuncResolver(input: Resolvers) {
  return input.isUsingFunc !== undefined;
}
function isClassResolver(input: Resolvers): boolean {
  return typeof input?.isUsingObject === 'function';
}
export function resolver<T>(input: Resolvers): T {
  if (isClassResolver(input)) {
    return input.create() as T;
  }
  return input as T;
}
