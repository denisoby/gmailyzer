import { BaseNetwork } from './base-network.class';

export class MessagesService {
  constructor(private _network: BaseNetwork) {}

  listRaw(options: {pageToken?: string} = {}): Promise<any> {
    return this._network.fetch('messages', {
      maxResults: 500,
      ...options
    });
  }

  list(options: {pageToken?: string} = {}) {
    return this.listRaw(options); // .then(({labels}) => this._convertArrToObject(labels));
  }

  getMetadata(id: string): Promise<any> {
    return this._network.fetch(`messages/${id}`, {
      format: 'metadata',
      metadataHeaders: 'labels'
    });

  }
}
