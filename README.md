# Injectofy

Injectofy is a TypeScript library designed to simplify dependency injection in your projects. It allows you to manage your dependencies easily, promoting better code organization and testability.

## Installation

You can install Injectofy using Yarn:

```bash
yarn add injectofy
```

Or using npm:

```bash
npm install injectofy
```

## Usage

### Setting Up the Container

First, set up the container in your project. This is where you'll register your dependencies.

```
import { Container } from 'injectofy';

const container = new Container();
```

### Registering Dependencies

You can register dependencies using the register method. You need to provide an identifier, the instance, and the class type.

#### Example Services

```
export class TestService {
  public getValue(): string {
    return 'Hello, Injectofy!';
  }
}

container.register('TestService', new TestService(), TestService);
```

Registering a Service
typescript
Copy code

Resolving Dependencies
You can resolve dependencies using the resolve method.

typescript
Copy code
const service = container.resolve('TestService');
console.log(service.getValue()); // Output: Hello, Injectofy!

```

```
