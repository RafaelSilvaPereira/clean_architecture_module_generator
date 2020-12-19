import { nullTernary } from "./aux.funtions";

export class FolderSufixes {
  readonly main: string;
  readonly mainDomain: string;
  readonly mainDomainModels: string;
  readonly mainDomainEntities: string;
  readonly mainDomainInterfaces: string;
  readonly mainInterfaces: string;
  readonly mainUsecases: string;
  readonly mainProtocol: string;
  readonly adapter: string;
  readonly adapterConnectors: string;
  readonly adapterDrives: string;
  readonly infra: string;
  readonly infraDatasources: string;
  readonly infraPresentation: string;

  constructor(builder: {
    main?: string;
    mainDomain?: string;
    mainDomainModels?: string;
    mainDomainEntities?: string;
    mainDomainInterfaces?: string;
    mainInterfaces?: string;
    mainUsecases?: string;
    mainProtocol?: string;
    adapter?: string;
    adapterConnectors?: string;
    adapterDrives?: string;
    infra?: string;
    infraDatasources?: string;
    infraPresentation?: string;
  }) {
    const {
      main,
      mainDomain,
      adapter,
      adapterConnectors,
      adapterDrives,
      infra,
      infraDatasources,
      infraPresentation,
      mainDomainEntities,
      mainDomainInterfaces,
      mainDomainModels,
      mainInterfaces,
      mainProtocol,
      mainUsecases,
    } = builder;

    this.main = nullTernary(main, "main");
    this.mainDomain = nullTernary(mainDomain, "domain");
    this.mainDomainEntities = nullTernary(mainDomainModels, "models");
    this.mainDomainEntities = nullTernary(mainDomainEntities, "entities");
    this.mainDomainInterfaces = nullTernary(mainDomainInterfaces, "typedefs");
    this.mainUsecases = nullTernary(mainUsecases, "usecases");
    this.mainInterfaces = nullTernary(mainUsecases, "interfaces");
    this.mainProtocol = nullTernary(mainProtocol, "protocols");
    this.adapter = nullTernary(adapter, "adapter");
    this.adapterConnectors = nullTernary(adapterConnectors, "connectors");
    this.adapterDrives = nullTernary(adapterDrives, "drives");
    this.infra = nullTernary(infra, "infra");
    this.infraDatasources = nullTernary(infraDatasources, "datasources");
    this.infraPresentation = nullTernary(infraPresentation, "presentation");
  }
}
