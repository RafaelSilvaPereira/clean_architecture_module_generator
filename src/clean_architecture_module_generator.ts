import fs from "fs";
import { InputMethod } from "./interfaces/input.method";
import {
  getDataClasses,
  getFunctionallityClasses,
} from "./models/aux.funtions";
import { ClassBuilder } from "./models/classbuilder";
import { ClassFileSufixes } from "./models/class_file.sufix";
import { ExportFileBuilder, FileBuilder } from "./models/filebuilder";
import { FolderGen } from "./models/folder.generator";
import { FolderSufixes } from "./models/folder.sufix";
import { CreationOptionsTypes, Params, RootPath } from "./models/params";

export class CleanArchitectureGenerator {
  async writeFolders(folders: FolderGen[]): Promise<void> {
    for (const folder of folders) {
      fs.mkdirSync(folder.path());
      console.log(`[writed] ${folder.path()}`);
    }
  }

  async generator(inputOption: InputMethod) {
    const params = await inputOption.getConfiguration();

    RootPath.I().setPath(params.creationOptions.path);

    if (params.creationOptions.type === CreationOptionsTypes.module) {
      this.writeNewModule(params, params.folderSufixes, params.fileSufixes);
    } else if (params.creationOptions.type === CreationOptionsTypes.usecase) {
      this.writeNewUsecase(params);
    } else {
      console.log("invalid option");
    }
  }

  async writeNewModule(
    params: Params,
    folderSufixes: FolderSufixes,
    classFileSufixes: ClassFileSufixes
  ) {
    RootPath.I().name = params.moduleBaseName;
    const rootFolder = new FolderGen({
      nestedLevel: 0,
      folderName: params.getFolderName(),
      parent: null,
    });

    const foldersMap = new Map<string, FolderGen>();
    foldersMap.set("root", rootFolder);
    this.getArchitectureFolders(rootFolder, folderSufixes).forEach((v, k) =>
      foldersMap.set(k, v)
    );

    await this.writeFolders(Array.from(foldersMap.values()));

    const dataClasses = this.getDataClassesClasseBuilder(
      foldersMap,
      params.dataModelsBaseName,
      classFileSufixes,
      folderSufixes
    );

    this.writeClasses([
      ...dataClasses.models,
      ...dataClasses.entities,
      ...dataClasses.domainInterface,
    ]);

    const functionallyClasses = this.getFunctionallyClasses(
      foldersMap,
      params,
      classFileSufixes,
      folderSufixes
    );

    this.writeClasses([
      ...functionallyClasses.connectors,
      ...functionallyClasses.datasources,
      ...functionallyClasses.drives,
      ...functionallyClasses.interfaces,
      ...functionallyClasses.protocols,
      ...functionallyClasses.usecases,
    ]);

    const exportsFiles = this.getExportFilesContent(
      folderSufixes,
      foldersMap,
      functionallyClasses,
      dataClasses
    );

    exportsFiles.forEach((exportFile) => this.writeFile(exportFile));
  }
  getExportFilesContent(
    folderSufixes: FolderSufixes,
    foldersMap: Map<string, FolderGen>,
    functionallyClasses: {
      connectors: ClassBuilder[];
      datasources: ClassBuilder[];
      drives: ClassBuilder[];
      interfaces: ClassBuilder[];
      protocols: ClassBuilder[];
      usecases: ClassBuilder[];
    },
    dataClassesMap: {
      entities: ClassBuilder[];
      models: ClassBuilder[];
      domainInterface: ClassBuilder[];
    }
  ): ExportFileBuilder[] {
    const rootFolder = foldersMap.get("root");
    const mainFolder = foldersMap.get(folderSufixes.main);
    const mainDomainFolder = foldersMap.get(folderSufixes.mainDomain);
    const mainDomainModelsFolder = foldersMap.get(
      folderSufixes.mainDomainModels
    );
    const mainDomainEntitiesFolder = foldersMap.get(
      folderSufixes.mainDomainEntities
    );
    const mainDomainInterfacesFolder = foldersMap.get(
      folderSufixes.mainDomainInterfaces
    );
    const mainInterfacesFolder = foldersMap.get(folderSufixes.mainInterfaces);
    const mainUsecasesFolder = foldersMap.get(folderSufixes.mainUsecases);
    const mainProtocolsFolder = foldersMap.get(folderSufixes.mainProtocol);
    const adapterFolder = foldersMap.get(folderSufixes.adapter);
    const adapterConnectorsFolder = foldersMap.get(
      folderSufixes.adapterConnectors
    );
    const adapterDrivesFolder = foldersMap.get(folderSufixes.adapterDrives);
    const infraFolder = foldersMap.get(folderSufixes.infra);
    const infraDatasourcesFolder = foldersMap.get(
      folderSufixes.infraDatasources
    );
    const infraPresentationFolder = foldersMap.get(
      folderSufixes.infraPresentation
    );

    rootFolder.exportFile.setContentFromFileNames([
      this.getExportFileFullPath(
        mainFolder.folderName,
        mainFolder.exportName()
      ),
      this.getExportFileFullPath(
        adapterFolder.folderName,
        adapterFolder.exportName()
      ),
      this.getExportFileFullPath(
        infraFolder.folderName,
        infraFolder.exportName()
      ),
    ]);

    mainFolder.exportFile.setContentFromFileNames([
      this.getExportFileFullPath(
        mainDomainFolder.folderName,
        mainDomainFolder.exportName()
      ),
      this.getExportFileFullPath(
        mainInterfacesFolder.folderName,
        mainInterfacesFolder.exportName()
      ),
      this.getExportFileFullPath(
        mainUsecasesFolder.folderName,
        mainUsecasesFolder.exportName()
      ),
      this.getExportFileFullPath(
        mainProtocolsFolder.folderName,
        mainProtocolsFolder.exportName()
      ),
    ]);
    mainDomainFolder.exportFile.setContentFromFileNames([
      this.getExportFileFullPath(
        mainDomainModelsFolder.folderName,
        mainDomainModelsFolder.exportName()
      ),
      this.getExportFileFullPath(
        mainDomainEntitiesFolder.folderName,
        mainDomainEntitiesFolder.exportName()
      ),
      this.getExportFileFullPath(
        mainDomainInterfacesFolder.folderName,
        mainDomainInterfacesFolder.exportName()
      ),
    ]);
    mainDomainModelsFolder.exportFile.setContentFromFileNames(
      dataClassesMap.models.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );

    mainDomainEntitiesFolder.exportFile.setContentFromFileNames(
      dataClassesMap.entities.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );
    mainDomainInterfacesFolder.exportFile.setContentFromFileNames(
      dataClassesMap.domainInterface.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );

    mainProtocolsFolder.exportFile.setContentFromFileNames(
      functionallyClasses.protocols.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );

    mainUsecasesFolder.exportFile.setContentFromFileNames(
      functionallyClasses.usecases.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );
    mainInterfacesFolder.exportFile.setContentFromFileNames(
      functionallyClasses.interfaces.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );
    adapterFolder.exportFile.setContentFromFileNames([
      this.getExportFileFullPath(
        adapterConnectorsFolder.folderName,
        adapterConnectorsFolder.exportName()
      ),
      this.getExportFileFullPath(
        adapterDrivesFolder.folderName,
        adapterDrivesFolder.exportName()
      ),
    ]);

    adapterConnectorsFolder.exportFile.setContentFromFileNames(
      functionallyClasses.connectors.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );
    adapterDrivesFolder.exportFile.setContentFromFileNames(
      functionallyClasses.drives.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );

    infraFolder.exportFile.setContentFromFileNames([
      this.getExportFileFullPath(
        infraDatasourcesFolder.folderName,
        infraDatasourcesFolder.exportName()
      ),
      this.getExportFileFullPath(
        infraPresentationFolder.folderName,
        infraPresentationFolder.exportName()
      ),
    ]);
    infraDatasourcesFolder.exportFile.setContentFromFileNames(
      functionallyClasses.datasources.map((c) =>
        this.getExportFileFullPathFromFiles(c.getFileName())
      )
    );
    // infraPresentationFolder.exportFile.setContentFromFileNames(
    //   functionallyClasses..map(c => this.getExportFileFullPath(any, c.getFileName())
    // ),

    const exportFiles = [
      rootFolder.exportFile,
      mainFolder.exportFile,
      mainDomainFolder.exportFile,
      mainDomainModelsFolder.exportFile,
      mainDomainEntitiesFolder.exportFile,
      mainDomainInterfacesFolder.exportFile,
      mainProtocolsFolder.exportFile,
      mainUsecasesFolder.exportFile,
      mainInterfacesFolder.exportFile,
      adapterFolder.exportFile,
      adapterConnectorsFolder.exportFile,
      adapterDrivesFolder.exportFile,
      infraFolder.exportFile,
      infraDatasourcesFolder.exportFile,
    ];

    return exportFiles;
  }

  private getExportFileFullPath(folderName: string, files: string): string {
    return `./${folderName}/${files}`;
  }

  private getExportFileFullPathFromFiles(file: string) {
    return `./${file}`;
  }
  /**
     

 *
 * @author Rafael S Pereira; @email: contato.dev.rafaelsp@gmail.com
 * @date 22/12/2020
 * @param {Map<string, FolderGen>} foldersMap
 * @param {Params} params
 * @param {ClassFileSufixes} classFileSufixes
 * @param {FolderSufixes} folderSufixes
 * @returns {*}  {{
 *     connectors: ClassBuilder[];
 *     datasources: ClassBuilder[];
 *     drives: ClassBuilder[];
 *     interfaces: ClassBuilder[];
 *     protocols: ClassBuilder[];
 *     usecases: ClassBuilder[];
 *   }}
 * @memberof CleanArchitectureGenerator
 */
  getFunctionallyClasses(
    foldersMap: Map<string, FolderGen>,
    params: Params,
    classFileSufixes: ClassFileSufixes,
    folderSufixes: FolderSufixes
  ): {
    connectors: ClassBuilder[];
    datasources: ClassBuilder[];
    drives: ClassBuilder[];
    interfaces: ClassBuilder[];
    protocols: ClassBuilder[];
    usecases: ClassBuilder[];
  } {
    const functionallyClasses = {
      connectors: new Array<ClassBuilder>(),
      datasources: new Array<ClassBuilder>(),
      drives: new Array<ClassBuilder>(),
      interfaces: new Array<ClassBuilder>(),
      protocols: new Array<ClassBuilder>(),
      usecases: new Array<ClassBuilder>(),
    };
    for (const usecaseBaseName of params.usecasesBaseName) {
      const mapFunctionallyClasses = getFunctionallityClasses(
        usecaseBaseName,
        classFileSufixes,
        {
          connectorsFolder: foldersMap.get(folderSufixes.adapterConnectors),
          datasourcesFolder: foldersMap.get(folderSufixes.infraDatasources),
          driversFolder: foldersMap.get(folderSufixes.adapterDrives),
          interfaceFolder: foldersMap.get(folderSufixes.mainInterfaces),
          protocolsFolder: foldersMap.get(folderSufixes.mainProtocol),
          usecasesFolder: foldersMap.get(folderSufixes.mainUsecases),
        }
      );

      functionallyClasses.connectors.push(mapFunctionallyClasses.connector);
      functionallyClasses.datasources.push(mapFunctionallyClasses.datasource);
      functionallyClasses.drives.push(mapFunctionallyClasses.drive);
      functionallyClasses.interfaces.push(mapFunctionallyClasses.interface);
      functionallyClasses.protocols.push(mapFunctionallyClasses.protocol);
      functionallyClasses.usecases.push(mapFunctionallyClasses.usecase);
    }

    return functionallyClasses;
  }

  getDataClassesClasseBuilder(
    folders: Map<string, FolderGen>,
    dataModelsBaseName: string[],
    classFileSufixes: ClassFileSufixes,
    folderSufixes: FolderSufixes
  ): {
    entities: ClassBuilder[];
    models: ClassBuilder[];
    domainInterface: ClassBuilder[];
  } {
    const dataClassesClassBuider = {
      entities: new Array<ClassBuilder>(),
      models: new Array<ClassBuilder>(),
      domainInterface: new Array<ClassBuilder>(),
    };

    for (const dataClassBaseName of dataModelsBaseName) {
      const dataClasses = getDataClasses(dataClassBaseName, classFileSufixes, {
        domainInterfaceFolder: folders.get(folderSufixes.mainDomainInterfaces),
        entitiesFolder: folders.get(folderSufixes.mainDomainEntities),
        modelsFolder: folders.get(folderSufixes.mainDomainModels),
      });

      dataClassesClassBuider.entities.push(dataClasses.entity);
      dataClassesClassBuider.models.push(dataClasses.model);
      dataClassesClassBuider.domainInterface.push(dataClasses.domainInterface);
    }

    return dataClassesClassBuider;
  }

  writeNewUsecase(params: Params) {
    const folderSufixes = params.folderSufixes;

    const path = params.creationOptions.path;
    const classFileSufixes: ClassFileSufixes = params.fileSufixes;
    RootPath.I().name = params.moduleBaseName;
    const rootFolder = new FolderGen({
      nestedLevel: 0,
      folderName: params.getFolderName(),
      parent: null,
    });

    const foldersMap = new Map<string, FolderGen>();
    foldersMap.set("root", rootFolder);
    this.getArchitectureFolders(rootFolder, folderSufixes).forEach((v, k) =>
      foldersMap.set(k, v)
    );

    const dataClasses = this.getDataClassesClasseBuilder(
      foldersMap,
      params.dataModelsBaseName,
      classFileSufixes,
      folderSufixes
    );

    this.writeClasses([
      ...dataClasses.models,
      ...dataClasses.entities,
      ...dataClasses.domainInterface,
    ]);

    const functionallyClasses = this.getFunctionallyClasses(
      foldersMap,
      params,
      classFileSufixes,
      folderSufixes
    );

    this.writeClasses([
      ...functionallyClasses.connectors,
      ...functionallyClasses.datasources,
      ...functionallyClasses.drives,
      ...functionallyClasses.interfaces,
      ...functionallyClasses.protocols,
      ...functionallyClasses.usecases,
    ]);

    const exportsFiles = this.getExportFilesContent(
      folderSufixes,
      foldersMap,
      functionallyClasses,
      dataClasses
    );

    exportsFiles.forEach((exportFile) => this.writeFile(exportFile));
  }

  getArchitectureFolders(
    rootFolder: FolderGen,
    folderSufixes: FolderSufixes
  ): Map<string, FolderGen> {
    const folders = new Map<string, FolderGen>();

    const mainFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.main,
      parent: rootFolder,
    });
    folders.set(folderSufixes.main, mainFolder);

    const domainFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.mainDomain,
      parent: mainFolder,
    });
    folders.set(folderSufixes.mainDomain, domainFolder);

    const domainInterfaces = new FolderGen({
      nestedLevel: 3,
      folderName: folderSufixes.mainDomainInterfaces,
      parent: domainFolder,
    });

    folders.set(folderSufixes.mainDomainInterfaces, domainInterfaces);

    const entitiesFolder = new FolderGen({
      nestedLevel: 3,
      folderName: folderSufixes.mainDomainEntities,
      parent: domainFolder,
    });
    folders.set(folderSufixes.mainDomainEntities, entitiesFolder);

    const modelsFolder = new FolderGen({
      nestedLevel: 3,
      folderName: folderSufixes.mainDomainModels,
      parent: domainFolder,
    });
    folders.set(folderSufixes.mainDomainModels, modelsFolder);

    const interfaceFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.mainInterfaces,
      parent: mainFolder,
    });

    folders.set(folderSufixes.mainInterfaces, interfaceFolder);

    const usecasesFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.mainUsecases,
      parent: mainFolder,
    });

    folders.set(folderSufixes.mainUsecases, usecasesFolder);

    const protocolsFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.mainProtocol,
      parent: mainFolder,
    });
    folders.set(folderSufixes.mainProtocol, protocolsFolder);

    const adpterFolder = new FolderGen({
      nestedLevel: 1,
      folderName: folderSufixes.adapter,
      parent: rootFolder,
    });
    folders.set(folderSufixes.adapter, adpterFolder);

    const connectorsFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.adapterConnectors,
      parent: adpterFolder,
    });
    folders.set(folderSufixes.adapterConnectors, connectorsFolder);

    const drivesFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.adapterDrives,
      parent: adpterFolder,
    });
    folders.set(folderSufixes.adapterDrives, drivesFolder);

    const infraFolder = new FolderGen({
      nestedLevel: 1,
      folderName: folderSufixes.infra,
      parent: rootFolder,
    });
    folders.set(folderSufixes.infra, infraFolder);

    const datasourcesFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.infraDatasources,
      parent: infraFolder,
    });
    folders.set(folderSufixes.infraDatasources, datasourcesFolder);

    const presentationFolder = new FolderGen({
      nestedLevel: 2,
      folderName: folderSufixes.infraPresentation,
      parent: infraFolder,
    });

    folders.set(folderSufixes.infraPresentation, presentationFolder);

    return folders;
  }

  async writeClasses(classes: ClassBuilder[]): Promise<void> {
    for (const classe of classes) {
      await this.writeFile(classe.fileBuilder);

      console.log(`[writed] ${classe.fileBuilder.getCompleteFileName()}`);
    }
  }

  async writeFile(fileBuilder: FileBuilder): Promise<void> {
    if (fs.readFileSync(fileBuilder.getCompleteFileName()).length === 0) {
      fs.writeFileSync(fileBuilder.getCompleteFileName(), fileBuilder.content);
    } else {
      fs.appendFileSync(fileBuilder.getCompleteFileName(), fileBuilder.content);
    }
  }
}
