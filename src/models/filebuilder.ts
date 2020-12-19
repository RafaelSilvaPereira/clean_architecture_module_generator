export class FileBuilder {
  constructor(
    public readonly name: string,
    public readonly location: string,
    public content?: string
  ) {}
  factory(name: string, location: string, content: string) {
    return new FileBuilder(`${name}.ts`, location, content);
  }
}

export class ExportFileBuilder extends FileBuilder {
  constructor(name: string, location: string) {
    super(`${name}.exports.ts`, location);
  }
}
