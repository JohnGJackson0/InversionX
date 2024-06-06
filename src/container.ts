import * as E from 'fp-ts/Either';

export type Constructor<T> = new (...args: any[]) => T;

interface ServiceEntry<T> {
  implementation: T;
}

class Container<T extends { [key: string]: any }> {
  private services = new Map<keyof T, T[keyof T]>();

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
          const { implementation } = initialServices[key]!;
          const register = this.register(key as keyof T, implementation);
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
    implementation: T[K]
  ): E.Either<Error, true> {
    this.services.set(identifier, implementation);
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
