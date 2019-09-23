import { BaseNetwork } from './base-network.class';

export class LabelsService {
  constructor(private _network: BaseNetwork) {}

  listRaw(): Promise<{labels: { id: string; name: string }[]}> {
    return this._network.fetch('labels');
  }

  list() {
    return this.listRaw().then(({labels}) => this._convertArrToObject(labels));
  }

  private _convertArrToObject(labels: any[]) {
    return labels.reduce(
      (acc: any, item: any) => (item.type === 'user' ? ({
        [item.id]: {
          id: item.id,
          name: item.name,
          count: 0,
          groupedCount: {}
        },
        ...acc
      }) : acc),
      {}
    );
  }
}
