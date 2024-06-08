import * as E from 'fp-ts/Either';
import { resolver } from './resolvers';
import { ObjectClass } from './resolvers/object';
import { validateServices } from './utils/container.utils';

export type Constructor<T> = new (...args: any[]) => T;

export interface ServiceEntry<T> {
  implementation: T;
}

class Container<T extends { [key: string]: any }> {
  private services = new Map<keyof T, T[keyof T]>();

  static createContainer<T extends { [key: string]: any }>(initialServices?: {
    [K in keyof T]?: ServiceEntry<T[K]>;
  }): E.Either<Error, Container<T>> {
    try {
      const container = new Container<T>(initialServices);
      const validation = validateServices(container.services);
      if (E.isLeft(validation)) {
        return E.left(validation.left);
      }
      return E.right(container);
    } catch (error) {
      return E.left(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * The `use` function constructs or retrieves dependencies.
   * It returns the instance of the specified service, whether
   * through `object(Service)` or `new Service`.
   */
  public use<K extends keyof T>(
    identifier: K
  ): E.Either<Error, T[K] extends ObjectClass<infer U, any> ? U : T[K]> {
    const service = this.getServiceFromContainer(identifier);
    if (E.isLeft(service)) {
      return E.left(service.left);
    }
    return E.right(resolver(service.right));
  }

  // Updates an existing dependency with a new implementation.
  public register<K extends keyof T>(
    identifier: K,
    implementation: T[K]
  ): E.Either<Error, true> {
    this.services.set(identifier, implementation);
    return E.right(true);
  }

  /**
   * A constructor cannot return arbitrary types. Therefore,
   * use `createContainer` to construct it, ensuring
   * E.Either error handling is maintained.
   */
  private constructor(initialServices?: {
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
  private getServiceFromContainer<K extends keyof T>(
    identifier: K
  ): E.Either<Error, T[K]> {
    const service: T[K] = this.services.get(identifier) as any;
    if (!service) {
      return E.left(
        new Error(`Service not found for identifier: ${String(identifier)}`)
      );
    }
    return E.right(service);
  }
}

export { Container };
