import { incorrectConstruction } from './object';

type ClassType<T> = { new (...args: any[]): T };
type FunctionType<T> = (() => T) | ((...args: any[]) => T);
type ValueType<T> = T;
type Resolvers<T = any> = ClassType<T> | FunctionType<T> | ValueType<T>;

export function isResolver(input: Resolvers): boolean {
  return isClassResolver(input) || isFuncResolver(input);
}

function isFuncResolver(input: Resolvers) {
  return (
    typeof input === 'function' &&
    input.isUsingFunc !== undefined &&
    input.isUsingFunc() === true
  );
}

function isClassResolver(input: Resolvers): boolean {
  return (
    typeof input === 'function' &&
    input.prototype &&
    input.prototype.constructor &&
    input?.isUsingObject !== undefined &&
    typeof input?.isUsingObject === 'function' &&
    input?.isUsingObject() === true
  );
}

export function resolver<T>(input: Resolvers): T {
  const args = input?.getArgs && input.getArgs();
  if (isClassResolver(input) && !!args && args.length > 0) {
    if (incorrectConstruction(input)) {
      throw Error(
        'There is a missing required parameter! Either Adjust the required parameters or correct the construction of the class.'
      );
    }
    return new (input as ClassType<T>)(...args);
  }
  if (isClassResolver(input)) {
    if (incorrectConstruction(input)) {
      throw Error(
        'There is a required parameter and it was not constructed! Use the object(class).contruct(...)'
      );
    }
    return new (input as ClassType<T>)();
  }

  return input as T;
}
