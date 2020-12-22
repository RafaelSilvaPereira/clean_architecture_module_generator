import { CleanArchitectureGenerator } from "./clean_architecture_module_generator";
import { InputMethod } from "./interfaces/input.method";
import { ClassFileSufixes } from "./models/class_file.sufix";
import { FolderSufixes } from "./models/folder.sufix";
import { CreationOptionsTypes, Params } from "./models/params";

class MockInput implements InputMethod {
  async getConfiguration(): Promise<Params> {
    const params: Params = new Params({
      moduleBaseName: "teste",
      dataModelsBaseName: ["Cliente1", "Cliente2"],
      usecasesBaseName: ["Uc1", "Uc2"],
      creationOptions: {
        type: CreationOptionsTypes.usecase,
        path:
          "/home/rafaelsp/projects/plugins/javascript/clean_architecture_module_generator/other",
        moduleBaseName: "teste",
      },
      fileSufixes: new ClassFileSufixes({}),
      folderSufixes: new FolderSufixes({}),
    });
    return params;
  }
}

const creator = new CleanArchitectureGenerator();
creator.generator(new MockInput());
