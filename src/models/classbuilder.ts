import { FileBuilder } from "./filebuilder";

export class ClassBuilder {
  readonly fileBuilder: FileBuilder;
  readonly className: string;
  readonly isInterface: boolean;
  readonly dependency: ClassBuilder;
  readonly superClass: ClassBuilder;
  readonly imports: string;

  constructor(builder: {
    fileBuilder: FileBuilder;
    className: string;
    isInterface: boolean;
    superClass?: ClassBuilder;
    dependency?: ClassBuilder;
    imports: "";
  }) {
    Object.assign(this, builder);
  }

  declaretionName() {
    return this.isInterface ? "I" + this.className : this.className;
  }

  static factory(builder: {
    className: string;
    filename: string;
    location: string;
    isInterface: boolean;
    superClass?: ClassBuilder;
    dependency?: ClassBuilder;
    imports: "";
  }): ClassBuilder {
    const {
      filename,
      className,
      location,
      isInterface,
      superClass,
      dependency,
      imports,
    } = builder;
    const validDepency = ClassBuilder.getValidDependency(dependency);
    const fullClassName = ClassBuilder.getFullClassName(
      validDepency,
      dependency
    );
    const fullPropertyName = ClassBuilder.getFullProptertyName(
      validDepency,
      dependency
    );

    const properties = ClassBuilder.getProperties(
      isInterface,
      validDepency,
      dependency
    );
    const classPrefix: string = ClassBuilder.getClassPrefix(isInterface);
    const _className: string = ClassBuilder.getClassFullName(
      isInterface,
      className
    );

    const constructorParams = ClassBuilder.getConstructorParams(
      dependency,
      fullPropertyName
    );
    const constructor = ClassBuilder.getConstructor(
      isInterface,
      _className,
      constructorParams
    );

    const supClass =
      superClass != null ? "implements ${superClass?.realClassName}" : "";
    const content = `\n
import '${imports.trim()}';

${classPrefix} ${_className} ${supClass} {
  ${properties}

   ${constructor}
}
`;
    return new ClassBuilder({
      isInterface: isInterface,
      className: className,
      fileBuilder: new FileBuilder(filename, location, content),
      imports: imports,
      dependency: dependency,
      superClass: superClass,
    });
  }
  static getConstructor(
    isInterface: boolean,
    _className: string,
    constructorParams: string
  ) {
    return !isInterface
      ? `$constructor(builder: ${constructorParams}) {
      Object.assing(this, builder);
    }`
      : "";
  }
  static getConstructorParams(
    dependency: ClassBuilder,
    fullPropertyName: string
  ): string {
    return dependency !== null
      ? `{${fullPropertyName}: ${dependency.declaretionName()}}`
      : "";
  }
  static getClassFullName(isInterface: boolean, className: string): string {
    return isInterface ? `I${className}` : className;
  }
  static getClassPrefix(isInterface: boolean): string {
    return isInterface ? "abstract class" : "class";
  }
  static getProperties(
    isInterface: boolean,
    validDepency: boolean,

    dependency: ClassBuilder
  ): string {
    let properties;
    if (!isInterface && validDepency) {
      properties = `readonly  ${dependency.className[0].toLowerCase()}${dependency.className.substring(
        1
      )}}; : : I${dependency.declaretionName()}`;
    } else {
      properties = "";
    }
    return properties;
  }
  static getFullProptertyName(
    validDepency: boolean,
    dependency: ClassBuilder
  ): string {
    return validDepency
      ? dependency.className[0].toLowerCase() +
          dependency.className.substring(1)
      : "";
  }

  static getFullClassName(
    validDepency: boolean,
    dependency: ClassBuilder
  ): string {
    return validDepency ? dependency.className : "";
  }

  static getValidDependency(dependency: ClassBuilder): boolean {
    return dependency !== null && dependency.className.length > 0;
  }
}
