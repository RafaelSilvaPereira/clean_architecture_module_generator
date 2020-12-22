import { ClassBuilder } from "./classbuilder";
import { ClassFileSufixes } from "./class_file.sufix";
import { FolderGen } from "./folder.generator";

export const nullTernary = (thing: any, other: any) =>
  !!thing ? thing : other;

export const toSnakeCase = (str: string): string =>
  str.trim().toLowerCase().split(" ").join("_");

export const toPascalCase = (str: string): string =>
  str
    .trim()
    .split(" ")
    .reduce((pv, cv) => `${pv}${cv[0].toUpperCase()}${cv.substring(1)}`);

export const createClass = (params: {
  isInterface: boolean;
  classBaseName: string;
  classTerminology: string;
  moduleFolderGen: FolderGen;
  classDependecy?: ClassBuilder;
  classExtension?: ClassBuilder;
}): ClassBuilder => {
  const {
    isInterface,
    classBaseName,
    classTerminology,
    moduleFolderGen,
    classDependecy,
    classExtension,
  } = params;
  const classNameSnackCase = toSnakeCase(classBaseName); // classBaseName
  const classNamePascalCase = toPascalCase(classBaseName); // classBaseName
  const classTermonolgySnackCase = toSnakeCase(classTerminology); // classTerminologyclassTermonolgy
  const classTermonolgyPascalCase = toPascalCase(classTerminology); // classTermonolgy

  const classBuildered = ClassBuilder.factory({
    imports: moduleFolderGen.getImports(),
    className: `${classNamePascalCase}${classTermonolgyPascalCase}`,
    isInterface: isInterface,
    filename: `${classNameSnackCase}.${classTermonolgySnackCase}`,
    location: moduleFolderGen.path(),
    dependency: classDependecy,
    superClass: classExtension,
  });

  return classBuildered;
};

export function getDataClasses(
  dataclassName: string,
  classesFilesSufix: ClassFileSufixes,
  builder: {
    modelsFolder: FolderGen;
    entitiesFolder: FolderGen;
    domainInterfaceFolder: FolderGen;
  }
): {
  entity: ClassBuilder;
  domainInterface: ClassBuilder;
  model: ClassBuilder;
} {
  const { modelsFolder, entitiesFolder, domainInterfaceFolder } = builder;

  const domainInterface = createClass({
    classBaseName: dataclassName,
    classTerminology: classesFilesSufix.domainInterface,
    isInterface: true,
    moduleFolderGen: domainInterfaceFolder,
  });

  const entity = createClass({
    classBaseName: dataclassName,
    classTerminology: classesFilesSufix.entity,
    isInterface: false,
    moduleFolderGen: entitiesFolder,
  });

  const model = createClass({
    classBaseName: dataclassName,
    classTerminology: classesFilesSufix.model,
    isInterface: false,
    moduleFolderGen: modelsFolder,
    classDependecy: entity,
  });

  const dataClassesBuilder = {
    entity: entity,
    domainInterface: domainInterface,
    model: model,
  };

  return dataClassesBuilder;
}

export function getFunctionallityClasses(
  usecaseClasseBaseName: string,
  classFileSufixes: ClassFileSufixes,
  builder: {
    interfaceFolder: FolderGen;

    protocolsFolder: FolderGen;
    driversFolder: FolderGen;
    usecasesFolder: FolderGen;
    connectorsFolder: FolderGen;
    datasourcesFolder: FolderGen;
  }
): {
  connector: ClassBuilder;
  datasource: ClassBuilder;
  drive: ClassBuilder;
  interface: ClassBuilder;
  protocol: ClassBuilder;
  usecase: ClassBuilder;
} {
  const {
    interfaceFolder,
    protocolsFolder,
    driversFolder,
    usecasesFolder,
    connectorsFolder,
    datasourcesFolder,
  } = builder;

  /// declare interfaces
  const mainInterface = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.mainInterface,
    isInterface: true,
    moduleFolderGen: interfaceFolder,
  });

  const protocolInterface = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.protocol,
    isInterface: true,
    moduleFolderGen: protocolsFolder,
  });

  const driveInterface = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.drive,
    isInterface: true,
    moduleFolderGen: driversFolder,
  });

  /// declare implementation

  const usecaseImpl = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.usecase,
    isInterface: false,
    moduleFolderGen: usecasesFolder,
    classExtension: mainInterface,
    classDependecy: protocolInterface,
  });

  const connectorImpl = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.connector,
    isInterface: false,
    moduleFolderGen: connectorsFolder,
    classExtension: protocolInterface,
    classDependecy: driveInterface,
  });

  const datasourcesImpl = createClass({
    classBaseName: usecaseClasseBaseName,
    classTerminology: classFileSufixes.datasource,
    isInterface: false,
    moduleFolderGen: datasourcesFolder,
    classExtension: driveInterface,
  });

  return {
    connector: connectorImpl,
    datasource: datasourcesImpl,
    drive: driveInterface,
    interface: mainInterface,
    protocol: protocolInterface,
    usecase: usecaseImpl,
  };
}
