
import { ClassFileSufixes } from "./class_file.sufix";
import { FolderSufixes } from "./folder.sufix";

export class Params {
  /**
   * Creates an instance of Params.
   * @author Rafael S Pereira; @email: contato.dev.rafaelsp@gmail.com
   * @date 18/12/2020
   * @param {*} builder
   * @memberof Params
   */
  path: string;
  moduleBaseName?: string;
  dataModelsBaseName: string[];
  interfaceModelsBaseName?: string[];
  usecasesBaseName: string[];
  folderSufixes: FolderSufixes;
  fileSufixes: ClassFileSufixes;
}