export type ObjectClass<T, A extends any[]> = {
  new (...args: A): T;
  validate(): void;
  isUsingObject(): boolean;
  getArgs(): A;
  construct(...args: A): ObjectClass<T, A>;
  createInstance(): T;
  getOriginalClass(): ObjectClass<T, A>;
  getNumberOfRequiredParameters(): number;
};

function getConstructorParamNames<T extends new (...args: any[]) => any>(
  cls: T
) {
  const clsStr = cls.toString();
  const constructorStr = clsStr.match(/constructor\s*\(([^)]*)\)/)?.[1] ?? '';
  return constructorStr
    .split(',')
    .map((param) => {
      const [name, defaultValue] = param.split('=').map((p) => p.trim());
      return {
        name,
        optional: defaultValue !== undefined,
      };
    })
    .filter((item) => item.name !== '');
}

function generateSchema<T extends new (...args: any[]) => any>(cls: T) {
  const paramNames = getConstructorParamNames(cls);
  const requiredParams = paramNames.filter((param) => !param.optional);
  return {
    requiredParams: requiredParams.map((param) => param.name),
  };
}

export function object<T extends object, A extends any[]>(
  ClassName: new (...args: A) => T | (new () => T)
): ObjectClass<T, A> {
  class WrappedClass {
    static originalClass = ClassName;
    static numOfRequiredParams =
      generateSchema(ClassName).requiredParams.length;
    static argsKey: A;
    static getNumberOfRequiredParameters() {
      return this.numOfRequiredParams ?? 0;
    }
    static getOriginalClass(): new (...args: A) => T | (new () => T) {
      return this.originalClass;
    }
    static isUsingObject(): boolean {
      return true;
    }
    static getArgs(): A {
      return this.argsKey;
    }
    static construct(...args: A): ObjectClass<T, A> {
      this.argsKey = args;
      return WrappedClass as unknown as ObjectClass<T, A>;
    }

    static hasArgs() {
      return !!this.getArgs && this.getArgs()?.length > 0;
    }

    static validate() {
      if (incorrectConstruction(this as unknown as ObjectClass<T, A>)) {
        throw Error(
          this.hasArgs()
            ? 'There is a missing required parameter! Either Adjust the required parameters or correct the construction of the class.'
            : 'There is a required parameter and it was not constructed! Use the object(class).contruct(...)'
        );
      }
    }

    static createInstance() {
      this.validate();
      return this.hasArgs()
        ? new this.originalClass(...this.getArgs())
        : new (this.originalClass as new () => T)();
    }
    constructor(...args: A) {
      const instance = new ClassName(...args);
      Object.assign(this, instance);
      return instance;
    }
  }
  Object.setPrototypeOf(WrappedClass.prototype, ClassName.prototype);
  return WrappedClass as unknown as ObjectClass<T, A>;
}
export function incorrectConstruction<T>(ctor: ObjectClass<T, any>): boolean {
  if (ctor.getNumberOfRequiredParameters() === 0) {
    return false;
  }
  return ctor.getNumberOfRequiredParameters() > (ctor.getArgs()?.length ?? 0);
}
