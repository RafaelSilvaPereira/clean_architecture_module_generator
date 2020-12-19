import { nullTernary } from "./aux.funtions";

export class ClassFileSufixes {
  readonly model: string;
  readonly entity: string;
  readonly domainInterface: string;
  readonly usecase: string;
  readonly mainInterface: string;
  readonly protocol: string;
  readonly connector: string;
  readonly drive: string;
  readonly datasource: string;
  readonly presentation: string;
  readonly convertClassSufixInFileSufix: (sufix: string) => string;

  constructor(builder: {
    model?: string;
    entity?: string;
    domainInterface?: string;
    usecase?: string;
    mainInterface?: string;
    protocol?: string;
    connector?: string;
    drive?: string;
    datasource?: string;
    presentation?: string;
    convertClassSufixInFileSufix?: (sufix: string) => string;
  }) {
    const {
      model,
      entity,
      domainInterface,
      usecase,
      mainInterface,
      protocol,
      connector,
      drive,
      datasource,
      presentation,
      convertClassSufixInFileSufix,
    } = builder;
    this.model = nullTernary(model, "Model");
    this.entity = nullTernary(entity, "Entity");
    this.domainInterface = nullTernary(domainInterface, "Typedef");
    this.mainInterface = nullTernary(mainInterface, "Interface");
    this.usecase = nullTernary(usecase, "Usecase");
    this.protocol = nullTernary(protocol, "Protocol");
    this.connector = nullTernary(connector, "Connector");
    this.drive = nullTernary(drive, "Drive");
    this.datasource = nullTernary(datasource, "Datasource");
    this.presentation = nullTernary(presentation, "Controller");
    this.convertClassSufixInFileSufix = nullTernary(
      convertClassSufixInFileSufix,
      (sufix: string) => sufix.toLowerCase()
    );
  }

  toFileSufix(sufix: string): string {
    return this.toFileSufix(sufix);
  }
}
