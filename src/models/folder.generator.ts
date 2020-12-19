import { ExportFileBuilder } from "./filebuilder";

class ModuleFolderGen {
 
  readonly level: number;

  readonly exportFile: ExportFileBuilder;

 
  readonly name: string;

 
  readonly parent: ModuleFolderGen;

 
  readonly folderName: String;
  constructor(builder: {
    level: number;
    name: string;
    parent: ModuleFolderGen;
    folderName: string;
  }) {
    Object.assign(this, builder);
    this.exportFile = new ExportFileBuilder(builder.name, this.path());
  }

  
  separator = () => "/";

  
  exportName = () => `${this.name}/${this.name}.exports.`;

  
  path() {
    const oldPath = ""; //`${(parent?.path ?? Directory.current.path)}`;
    const newPath = this.name != null ? `${this.separator()}${this.name}` : "";

    return `${oldPath}${newPath}`;
  }

  
  getImports() {
    let numberOfBars = "";
    for (var i = 0; i < this.level; i++) {
      numberOfBars += "../";
    }
    return `${numberOfBars}${this.folderName}.exports.dart`;
  }

  
  generateExportFile(filesNames: string[]): void {
    
    const content = filesNames.reduce(
      (pv, cv) => `${cv}\nexport *  from '${cv.replace(".ts", "")}'`
    );
    this.exportFile.content = content;
  }
}
