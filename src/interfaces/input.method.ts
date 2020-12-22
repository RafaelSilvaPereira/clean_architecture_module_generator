import { Params } from "../models/params";

export abstract class InputMethod {
  abstract getConfiguration(): Promise<Params>;
}