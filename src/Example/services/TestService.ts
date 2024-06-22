export class TestService {
  something: string = '';
  constructor(something: string) {
    this.something = something;
  }
  public getValue(): string {
    return `${this.something}`;
  }
}
