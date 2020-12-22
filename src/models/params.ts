import { toSnakeCase } from "./aux.funtions";
import { ClassFileSufixes } from "./class_file.sufix";
import { FolderSufixes } from "./folder.sufix";

export class RootPath {
  static instance: RootPath;
  setPath(path: string) {
    this.path = path;
  }
  path: string;
  name: string;
  static I() {
    if (!RootPath.instance) {
      RootPath.instance = new RootPath();
    }
    return RootPath.instance;
  }
}

export class Params {
  moduleBaseName?: string;
  dataModelsBaseName: string[];
  usecasesBaseName: string[];
  creationOptions: CreationOptions;
  folderSufixes: FolderSufixes;
  fileSufixes: ClassFileSufixes;

  getFolderName() {
    return toSnakeCase(this.moduleBaseName);
  }

  constructor(builder: {
    moduleBaseName?: string;
    dataModelsBaseName: string[];
    usecasesBaseName: string[];
    creationOptions: CreationOptions;
    folderSufixes: FolderSufixes;
    fileSufixes: ClassFileSufixes;
  }) {
    Object.assign(this, builder);
  }
}

export interface CreationOptions {
  readonly type: CreationOptionsTypes.module | CreationOptionsTypes.usecase;
  readonly path: string;
  readonly moduleBaseName?: string;
}

export enum CreationOptionsTypes {
  module,
  usecase,
}
