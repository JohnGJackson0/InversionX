# InversionX

InversionX is a TypeScript library designed to simplify dependency injection in your projects. It allows you to manage your dependencies easily, promoting better code organization and testability.

## Installation

You can install InversionX using Yarn:

```bash
yarn add inversionx
```

Or using npm:

```bash
npm install inversionx
```

## Usage

### Setting Up the Container

In a high-level part of the application with no external dependencies, you would create a specification that defines the application's dependencies. For example:

```
interface AppServices {
  TestService: ObjectClass<TestService, [string]>;
  TestService2: TestService;
  TestService3: () => string;
  TestService4: FuncClass<[a: number, b: number], number>;
}
```

Note: For ObjectClass and FuncClass, using use will unpack them into a invoked function or class instance. It will not invoke or construct them until they are used.

#### Defining Implementation Details

The purpose of the dependency injection library is to serve as a central repository for implementations. In the example above, you define interfaces, which are less likely to change. The application relies on these interfaces rather than specific implementations, allowing you to change the implementations without affecting the application. This part focuses on how you will fulfill the interface definitions. For Example:

```
const initialServices = {
  TestService: {
    // lazy class construction
    implementation: object(TestService).construct('TEST'),
  },
  TestService2: {
    implementation: new TestService('TEST 2'),
  },
  TestService3: {
    implementation: () => {
      return 'TEST 3';
    },
  },
  TestService4: {
    // lazy function construction
    implementation: func((a: number, b: number) => a + b, [1, 1]),
  },
};
```

#### Container Creation

Here’s an example demonstrating how to construct such a container. The library uses fp-ts, which ensures that errors are communicated through the TypeScript type system at all entry points. You can then unpack these errors with Fold. We use a closure to handle failures at a high level, allowing us to work with a simplified definition later on. Another reason for using closures is to define a strict scope for which the container can be changed.

```
function _container() {
  const iocContainer = Container.createContainer<AppServices>(initialServices);
  if (E.isLeft(iocContainer)) {
    // handle errors at highest level, rethrow, or E.left, your choice...
    throw new Error(iocContainer.left.message);
  }
  const container = iocContainer.right;
  function useService<T extends keyof AppServices>(num: T) {
    const service = container.use(num);
    if (E.isLeft(service)) {
      // handle errors at highest level, rethrow, or E.left, your choice...
      throw new Error(service.left.message);
    }
    return service.right;
  }
  return { useService };
}

export const iocContainer = _container();
```

#### Using dependencies

Now, we can use it directly with ease. Notice that the type is correctly inferred as TestService, even though the container is of type ObjectClass<TestService, [string]>. The class is constructed at the time of useService since we used object.construct().

```
iocContainer.useService('TestService')
```

Use it per normally. Here is a unit test demonstrating it:

```
expect(iocContainer.useService('TestService').getValue()).toEqual('TEST');
```

#### Futher

Make sure to follow the unit tests and example folder for more information.
