import {BaseNetwork} from "./base-network.class";

export class LabelsService {
  constructor(private _network: BaseNetwork){}

  list() {
    return this._network.fetch('labels');
  }
}
