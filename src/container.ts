interface ServiceIdentifier<T> {
  new (...args: any[]): T;
}

class Container {
  private services = new Map<ServiceIdentifier<any>, any>();

  public register<T>(
    identifier: ServiceIdentifier<T>,
    implementation: T
  ): void {
    this.services.set(identifier, implementation);
  }

  public resolve<T>(identifier: ServiceIdentifier<T>): T {
    const service = this.services.get(identifier);
    if (!service) {
      throw new Error(`Service not found for identifier: ${identifier}`);
    }
    return service;
  }
}

export { Container };
