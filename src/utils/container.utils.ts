import * as E from 'fp-ts/Either';
import { isClassResolver } from '../resolvers/resolver';

export function validateServices<T>(
  services: Map<keyof T, T[keyof T]>
): E.Either<Error, void> {
  for (const [_, service] of Array.from(services.entries())) {
    if (isClassResolver(service)) {
      try {
        service?.validate();
      } catch (e) {
        return E.left(
          e instanceof Error
            ? new Error(e.message)
            : new Error('Something went wrong')
        );
      }
    }
  }
  return E.right(undefined);
}
