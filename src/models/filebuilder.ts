export class FileBuilder {
  public content: string;
  constructor(
    public readonly name: string,
    public readonly path: string,
    content?: string
  ) {
    this.content = content;
  }
  static factory(name: string, path: string, content: string) {
    return new FileBuilder(`${name}.ts`, path, content);
  }

  getCompleteFileName() {
    return `${this.path}/${this.name}`;
  }
}

export class ExportFileBuilder extends FileBuilder {
  setContentFromFileNames(filesNames: string[]) {
    this.content = filesNames.reduce(
      (pv, cv) => `${pv}\nexport *  from '${cv.replace(".ts", "")}';`,
      ""
    );
  }
  constructor(name: string, location: string) {
    super(`${name}.exports.ts`, location);
  }
}
