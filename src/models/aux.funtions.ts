import { ClassBuilder } from "./classbuilder";

export const nullTernary = (thing: any, other: any) =>
  thing != null ? thing : other;

export const toSnakeCase = (str: string): string => str;
export const toPascalCase = (str: string): string => str;

export const createClasses = (params: {
  isInterface: boolean;
  classBaseName: string;
  classTerminology: string;
  moduleFolderGen: any;
  classDependecy?: ClassBuilder;
  classExtension?: ClassBuilder;
}) => {
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
    imports: moduleFolderGen.imports,
    className: "$classNamePascalCase$classTermonolgyPascalCase",
    isInterface: isInterface,
    filename: "$classNameSnackCase.$classTermonolgySnackCase",
    location: moduleFolderGen.path,
    dependency: classDependecy,
    superClass: classExtension,
  });
  return classBuildered;
};
