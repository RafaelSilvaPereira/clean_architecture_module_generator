import { Params } from "../models/params";

abstract class InputMethod {
  abstract getConfiguration(): Promise<Params>;
}