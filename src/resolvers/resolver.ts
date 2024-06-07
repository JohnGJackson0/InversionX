import { ObjectClass } from './object';

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

function isClassResolver<T, A extends any[]>(
  input: any
): input is ObjectClass<T, A> {
  return (
    typeof input.createInstance === 'function' &&
    typeof input?.isUsingObject === 'function'
  );
}

export function resolver<T, A extends any[]>(input: T | ObjectClass<T, A>) {
  if (isClassResolver<T, A>(input)) {
    return input.createInstance();
  }
  return input;
}
