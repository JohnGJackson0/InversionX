class Container {
  private services = new Map<string, any>();

  public register<T>(identifier: string, implementation: T): void {
    this.services.set(identifier, implementation);
  }

  public resolve<T>(identifier: string): T {
    const service = this.services.get(identifier);
    if (!service) {
      throw new Error(`Service not found for identifier: ${identifier}`);
    }
    return service;
  }
}

export { Container };
