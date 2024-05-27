import * as E from 'fp-ts/Either';

type Constructor<T> = new (...args: any[]) => T;
type Factory<T> = () => T;

interface ServiceEntry<T> {
  implementation: T;
  type: Constructor<T> | Factory<T>;
}

class Container<T extends { [key: string]: any }> {
  private services = new Map<keyof T, T[keyof T]>();
  private types = new Map<
    keyof T,
    Constructor<T[keyof T]> | Factory<T[keyof T]>
  >();

  static createContainer<T extends { [key: string]: any }>(initialServices?: {
    [K in keyof T]?: ServiceEntry<T[K]>;
  }): E.Either<Error, Container<T>> {
    try {
      return E.right(new Container<T>(initialServices));
    } catch (error) {
      return E.left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  constructor(initialServices?: {
    [K in keyof T]?: ServiceEntry<T[K]>;
  }) {
    if (initialServices) {
      for (const key in initialServices) {
        if (initialServices.hasOwnProperty(key)) {
          const { implementation, type } = initialServices[key]!;
          const register = this.register(key as keyof T, implementation, type);
          E.fold(
            (error: Error) => {
              throw error;
            },
            (_value: true) => {
              return;
            }
          )(register);
        }
      }
    }
  }

  public register<K extends keyof T>(
    identifier: K,
    implementation: T[K],
    type: Constructor<T[K]> | Factory<T[K]>
  ): E.Either<Error, true> {
    if (this.types.has(identifier) && this.types.get(identifier) !== type) {
      return E.left(
        new Error(
          `Type mismatch: ${String(identifier)} is already registered with a different type`
        )
      );
    }

    this.services.set(identifier, implementation);
    this.types.set(identifier, type);
    return E.right(true);
  }

  public resolve<K extends keyof T>(identifier: K): E.Either<Error, T[K]> {
    const service: T[K] = this.services.get(identifier) as any;
    if (!service) {
      return E.left(
        new Error(`Service not found for identifier: ${String(identifier)}`)
      );
    }
    return E.right(service);
  }

  public use<K extends keyof T>(identifier: K): T[K] {
    const service = this.resolve(identifier);
    if (E.isLeft(service)) {
      throw service.left;
    }
    return service.right;
  }
}

export { Container };
