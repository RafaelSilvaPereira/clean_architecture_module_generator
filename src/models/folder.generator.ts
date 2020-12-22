import { nullTernary } from "./aux.funtions";
import { ExportFileBuilder } from "./filebuilder";
import { RootPath } from "./params";

export interface FolderGenBuilder {
  nestedLevel: number;
  parent: FolderGen;
  folderName: string;
}

export class FolderGen {
  readonly nestedLevel: number;
  readonly exportFile: ExportFileBuilder;

  readonly parent: FolderGen;
  readonly folderName: string;

  constructor(builder: FolderGenBuilder) {
    Object.assign(this, builder);
    this.exportFile = new ExportFileBuilder(builder.folderName, this.path());
  }

  separator = () => "/";

  exportName = () => this.exportFile.name;

  path(): string {
    const oldPath = `${nullTernary(this.parent?.path(), RootPath.I().path)}`;
    const newPath =
      this.folderName != null ? `${this.separator()}${this.folderName}` : "";
    return `${oldPath}${newPath}`;
  }

  getImports(): string {
    let numberOfBars = "";
    for (var i = 0; i < this.nestedLevel; i++) {
      numberOfBars += "../";
    }
    return `${numberOfBars}${RootPath.I().name}.exports`;
  }

  generateExportFile(filesNames: string[]): void {
    this.exportFile.setContentFromFileNames(filesNames);
  }
}
